import sqlite3

class QueryModel:
    def __init__(self, database_file):
        self.database_file = database_file

    def execute_query(self, sql_query):
        conn = sqlite3.connect(self.database_file)
        cursor = conn.cursor()
        cursor.row_factory = sqlite3.Row
        cursor.execute(sql_query)
        result = cursor.fetchall()
        conn.close()
        return result
    
    def execute_query_by_id(self, sql_query):
        conn = sqlite3.connect(self.database_file)
        cursor = conn.cursor()
        cursor.row_factory = sqlite3.Row
        cursor.execute(sql_query)
        result = cursor.fetchone()
        conn.close()
        return result

    def column_query(self, sql_query):
        conn = sqlite3.connect(self.database_file)
        cursor = conn.cursor()
        cursor.execute(sql_query)
        result = cursor.fetchall()
        conn.close()
        return result

    def execute_update(self, sql_query):
        conn = sqlite3.connect(self.database_file)
        conn.execute('PRAGMA foreign_keys = ON')
        cursor = conn.cursor()
        cursor.row_factory = sqlite3.Row
        cursor.execute(sql_query)
        conn.commit()

    def get_all_questions(self):
        query = "SELECT * FROM question_collection"
        return self.execute_query(query)
    
    def save_new_open_question_to_db(self, question):
        query = f'''INSERT INTO question_collection(question_text, archive, type)
                            VALUES("{question}", False, False)'''
        return self.execute_update(query)
    
    def commit_query(self, sql_query):
        conn = sqlite3.connect(self.database_file)
        cursor = conn.cursor()
        cursor.execute(sql_query)
        conn.commit()
        cursor.close()

    def save_new_mc_question_to_db(self, question, options):
        query = f'''INSERT INTO question_collection(question_text, archive, type)
                            VALUES("{question}", False, True)'''
        self.execute_update(query)
        id_query = self.execute_query(
                '''SELECT max (question_collection_id) FROM question_collection''')
        counter = 1
        for option in options:
            fill_multiple_choice_options = f'''INSERT INTO multiple_choice(number, answer, question_collection_id)
                                                                        VALUES ({counter}, "{option}", "{id_query[0][0]}")'''
            counter +=1
            self.execute_update(fill_multiple_choice_options)
        return "Question is saved"
    
    def get_mc_options_by_id(self, question_id):
        query = f'''SELECT answer FROM multiple_choice
                            WHERE question_collection_id IS {question_id}'''
        return self.execute_query(query)
    
    def save_new_survey(self,title, questions, anonymous):
        # Saves survey shell
        query = f'''INSERT INTO survey(name, archive, anonymous, user_id)
                            VALUES ("{title}", False, {anonymous}, 1)'''
        self.execute_update(query)
        survey_id = self.execute_query('''SELECT max (survey_id) FROM survey''')
        count = 1

        # Loops through all questions and check if they exist in db
        for question in questions:
            q = question["question"]
            query = f'''SELECT EXISTS
                                (SELECT 1. question_collection_id
                                FROM question_collection
                                WHERE question_text IS "{question["question"]}")'''
            check = self.execute_query(query)[0][0]

            # If check = 0 question does not exist yet and is saved in db
            if question ["type"] ==  "open" and check == 0:
                query = f'''INSERT INTO question_collection(question_text, archive, type) VALUES("{q}", False, False)'''
                self.execute_update(query)
                question_id = self.execute_query('''SELECT max (question_collection_id) FROM question_collection''')

                query = f'''INSERT INTO question(question_collection_id, question_text, sequence, survey_id)
                                    VALUES ({question_id[0][0]}, "{q}", {count}, {survey_id[0][0]})'''
                count+=1
                self.execute_update(query)
            elif question ["type"] ==  "multiple choice" and check == 0:
                # Inserts question into db
                query = f'''INSERT INTO question_collection(question_text, archive, type) VALUES("{q}", False, True)'''
                self.execute_update(query)
                question_id = self.execute_query('''SELECT max (question_collection_id) FROM question_collection''')
                query = f'''INSERT INTO question(question_collection_id, question_text, sequence, survey_id)
                                    VALUES ({question_id[0][0]}, "{q}", {count}, {survey_id[0][0]})'''
                self.execute_update(query)
                count +=1
                option_counter = 1
                # Inserts options in db
                for option in question["options"]:
                    query = f'''INSERT INTO multiple_choice(number, answer, question_collection_id)
                                                                                VALUES ({option_counter}, "{option}", "{question_id[0][0]}")'''
                    option_counter +=1
                    self.execute_update(query)
            # If question does exist in db add it to survey
            else:
                query = f'''SELECT question_collection_id FROM question_collection
                                WHERE question_text = "{q}"'''
                question_id = self.execute_query(query)
                query = f'''INSERT INTO question(question_collection_id, question_text, sequence, survey_id)
                                    VALUES ({question_id[0][0]}, "{q}", {count}, {survey_id[0][0]})'''
                count +=1
                self.execute_update(query)
            


    def add_open_question_to_survey(self, id, question, sequence):
        query = f'''INSERT INTO question_collection(question_text, archive, type)
                            VALUES("{question}", False, False)'''
        conn = sqlite3.connect(self.database_file)
        cursor = conn.cursor()
        cursor.row_factory = sqlite3.Row
        cursor.execute(query)
        item = cursor.lastrowid
        query = f'''SELECT * FROM question_collection WHERE question_collection_id = {item}'''
        cursor.execute(query)
        question_collection =  cursor.fetchone()
        print(item)
        conn.commit()
        query = f'''INSERT INTO question(question_text, survey_id, question_collection_id, sequence)
                            VALUES("{question}", {id}, {question_collection['question_collection_id']}, {sequence})'''
        cursor.execute(query)
        conn.commit()
        return item
    
    def add_mc_question_to_survey(self, id, question, sequence, answers):
        query = f'''INSERT INTO question_collection(question_text, archive, type)
                            VALUES("{question}", False, True)'''
        conn = sqlite3.connect(self.database_file)
        cursor = conn.cursor()
        cursor.row_factory = sqlite3.Row
        cursor.execute(query)

        item = cursor.lastrowid
        query = f'''SELECT * FROM question_collection WHERE question_collection_id = {item}'''
        cursor.execute(query)
        question_collection =  cursor.fetchone()
        conn.commit()

        query = f'''INSERT INTO question(question_text, survey_id, question_collection_id, sequence)
                            VALUES("{question}", {id}, {question_collection['question_collection_id']}, {sequence})'''
        cursor.execute(query)
        conn.commit()
        
        for answer in answers:
            query = f'''INSERT INTO multiple_choice(number, answer, question_collection_id)
                            VALUES("{answer['index']+1}", "{answer['choice']}", {item})'''
            cursor.execute(query)
            conn.commit()
        return item


    def edit_mc_choices(self, choices):
        conn = sqlite3.connect(self.database_file)
        cursor = conn.cursor() 
        print(choices)
        for choice in choices:
            print(choice)
            query = f'''UPDATE multiple_choice SET answer = "{choice['choice']}" WHERE multiple_choice_id = {choice['id']}'''
            cursor.execute(query)
            conn.commit()
        return "success"
