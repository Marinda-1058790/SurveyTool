import sqlite3
import random
from sqlite3 import Error
from faker import Faker
from bcrypt_init import bcrypt
from query_model import QueryModel

fake = Faker()
query_model = QueryModel('database/database.db')

# Create a database connection to a SQLite database


def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        print(sqlite3.version)
        return conn
    except Error as e:
        print(e)
    return conn

# Create database tables


def create_table(conn, create_table_sql):
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)


def table_queries():
    database = 'database/database.db'
    sql_create_user_table = """CREATE TABLE IF NOT EXISTS user (
                                                    user_id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                                                    admin integer NOT NULL,
                                                    email text NOT NULL UNIQUE,
                                                    password text NOT NULL,
                                                    first_name text NOT NULL,
                                                    last_name text NOT NULL
                                                )"""

    sql_create_survey_table = """CREATE TABLE IF NOT EXISTS survey (
                                                                survey_id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                                                                name text NOT NULL,
                                                                archive integer,
                                                                anonymous integer,
                                                                user_id integer NOT NULL,
                                                                FOREIGN KEY (user_id) REFERENCES user (user_id)
                                                            )"""

    sql_create_question_table = """CREATE TABLE IF NOT EXISTS question (
                                                        question_id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                                                        question_collection_id integer NOT NULL,
                                                        question_text text NOT NULL,
                                                        sequence integer NOT NULL,
                                                        survey_id integer NOT NULL,
                                                        FOREIGN KEY (question_collection_id) REFERENCES  question_collection (question_collection_id),
                                                        FOREIGN KEY (survey_id) REFERENCES survey (survey_id)
                                                    )"""

    # 0 is open-ended question, 1 is closed-ended question
    sql_create_question_collection_table = """CREATE TABLE IF NOT EXISTS question_collection (
                                                                        question_collection_id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                                                                        question_text text NOT NULL,
                                                                        archive integer NOT NULL,
                                                                        type integer NOT NULL
                                                                    )"""

    sql_create_multiple_choice_table = """CREATE TABLE IF NOT EXISTS multiple_choice (
                                                                multiple_choice_id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                                                                number text NOT NULL,
                                                                answer text NOT NULL,
                                                                question_collection_id integer NOT NULL,
                                                                FOREIGN KEY (question_collection_id) REFERENCES  question_collection (question_collection_id)
                                                            )"""

    sql_create_answer_table = """CREATE TABLE IF NOT EXISTS answer (
                                                    answer_id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                                                    answer text NOT NULL,
                                                    question_id integer NOT NULL,
                                                    user_id integer NOT NULL,
                                                    FOREIGN KEY (question_id) REFERENCES question (question_id),
                                                    FOREIGN KEY (user_id) REFERENCES user (user_id)
                                                )"""

    conn = create_connection(database)

    if conn is not None:
        # Create tables
        create_table(conn, sql_create_user_table)
        create_table(conn, sql_create_survey_table)
        create_table(conn, sql_create_question_collection_table)
        create_table(conn, sql_create_multiple_choice_table)
        create_table(conn, sql_create_question_table)
        create_table(conn, sql_create_answer_table)
        conn.close()
    else:
        print("Error! Cannot create the database connection.")

# Fill database with fake data


def db_fill_user():
    try:
        name = fake.name()
        f_name = name.split()[0]
        l_name = name.split()[1]
        em = 'admin@email.com'.lower()
        passw = bcrypt.generate_password_hash("werkplaats4").decode("utf-8")
        sql_fill_user_query = f'''INSERT INTO user(first_name, last_name, email, password, admin)
                                                VALUES("{f_name}", "{l_name}", "{em}", "{passw}", True)'''
        query_model.execute_update(sql_fill_user_query)
        for i in range(10):
            name = fake.name()
            f_name = name.split()[0]
            l_name = name.split()[1]
            em = f'{f_name}{l_name}@email.com'.lower()
            passw = bcrypt.generate_password_hash(
                "werkplaats4").decode("utf-8")
            sql_fill_user_query = f'''INSERT INTO user(first_name, last_name, email, password, admin)
                                                    VALUES("{f_name}", "{l_name}", "{em}", "{passw}", False)'''
            query_model.execute_update(sql_fill_user_query)
    except Error as e:
        print(e)
    finally:
        print("User table is filled.")


def db_fill_question_collection():
    try:
        text = [
            "Hoe is je dag?",
            "Wat vind je van deze vraag?"
        ]
        for question in text:
            sql_fill_question_collection_query = f'''INSERT INTO question_collection(question_text, archive, type)
                                                                            VALUES("{question}", False, False)'''
            query_model.execute_update(sql_fill_question_collection_query)
    except Error as e:
        print(e)
    finally:
        print("Question collection open-ended table is filled.")


def db_fill_multiple_choice():
    try:
        text = [
            ["Regent het vandaag?", [['a', 'Ja'], ['b', 'Nee'], ['c', 'Misschien']]],
            ["Heb je lekker geslapen?", [['1', 'Ja'], ['2', 'Nee'],
                                         ['3', 'Redelijk'], ['4', 'Nee totaal niet']]],
            ["Heb je een goed weekend gehad?", [['a', 'Ja'], ['b', 'Nee']]]
        ]
        i = 0
        for question in text:
            sql_fill_question_collection_query = f'''INSERT INTO question_collection(question_text, archive, type)
                                                                            VALUES("{question[0]}", False, True)'''
            query_model.execute_update(sql_fill_question_collection_query)
            id_query = query_model.execute_query(
                '''SELECT max (question_collection_id) FROM question_collection''')

            for item in text[i][1]:
                sql_fill_multiple_choice_query = f'''INSERT INTO multiple_choice(number, answer, question_collection_id)
                                                                        VALUES ("{item[0]}", "{item[1]}", "{id_query[0][0]}")'''
                query_model.execute_update(sql_fill_multiple_choice_query)

            i = i+1
    except Error as e:
        print(e)
    finally:
        print("Question collection multiple choice table is filled.")


def db_fill_survey():
    try:
        text = [
            ["Vragenlijst 1", 1],
            ["Vragenlijst 2", 2],
            ["Vragenlijst 3", 3]
        ]
        for item in text:
            sql_fill_question_collection_query = f'''INSERT INTO survey(name, archive, anonymous, user_id)
                                                                            VALUES("{item[0]}", False, False, 1)'''
            query_model.execute_update(sql_fill_question_collection_query)
            # id_query = query_model.execute_query('''SELECT max (survey) FROM survey''')

            ids = [
                [1, 'Hoe is je dag?'], 
                [2, 'Wat vind je van deze vraag?'], 
                [3, 'Regent het vandaag?'], 
                [4, 'Heb je lekker geslapen?'], 
                [5, 'Heb je een goed weekend gehad?']
            ]
            for id in ids:
                sql_fill_multiple_choice_query = f'''INSERT INTO question(question_collection_id, sequence, question_text, survey_id)
                                                                        VALUES ({id[0]}, {id[0]}, "{id[1]}", {item[1]})'''
                query_model.execute_update(sql_fill_multiple_choice_query)
    except Error as e:
        print(e)
    finally:
        print("Survey and Question table filled")


def db_fill_answer():
    try:
        text = [
            ["Dit is een antwoord", 1, 2],
            ["Dit is nog een antwoord", 1, 3],
            ["Je raad het al, dit is nog een antwoord", 1, 4],
            ["WAUW! dit meen je niet, dit is nog een antwoord", 1, 5],
            ["Ik ben niet blij", 2, 2],
            ["Ik haat dit *** werk", 2, 3],
            ["Is het al weekend", 2, 4],
            ["Anja heeft mijn boterham opgegeten", 2, 5],
            ["a", 3, 2],
            ["b", 3, 3],
            ["a", 3, 4],
            ["c", 3, 5],
            ["1", 4, 2],
            ["4", 4, 3],
            ["2", 4, 4],
            ["3", 4, 5],
            ["a", 5, 2],
            ["b", 5, 3],
            ["a", 5, 4],
            ["b", 5, 5],

        ]
        for item in text:
            sql_fill_answer_query = f'''INSERT INTO answer(answer, question_id, user_id)
                                                                            VALUES("{item[0]}", {item[1]}, {item[2]})'''
            query_model.execute_update(sql_fill_answer_query)

    except Error as e:
        print(e)
    finally:
        print("Survey and Question table filled")


if __name__ == '__main__':
    create_connection('database/database.db')
    table_queries()
    db_fill_user()
    db_fill_question_collection()
    db_fill_multiple_choice()
    db_fill_survey()
    db_fill_answer()
