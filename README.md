# WERKPLAATS 4

## Available Scripts

Instellen van de /frontend map:

* `cd frontend`
* `npm install`
* `npm start`


## Open een nieuwe terminal

Instellen van de /backend map:

* `cd backend`
* `python -m venv venv`
* `.\venv\Scripts\activate`
* `pip install -r requirements.txt`
* `python server.py`


## De frontend map gaat er vanuit dat je flask runt op: http://localhost:5000/


## Inloggen 
Gebruikersnaam: admin@email.com
Wachtwoord: werkplaats4


## Het platform
Binnen het platform zijn er verschillende gradaties:
* Admin: de admins hebben toegang tot de gehele applicatie. 
    Zij kunnen nieuwe vragenlijsten maken, bestaande vragenlijsten aanpassen en verwijderen en teamleden uitnodigen tot invullen van de vragenlijsten. 
* Teamlid: Zij worden uitgenodigd door middel van het kopiëren van een link. 
    Zodoende kunnen zij een vragenlijst invullen. Teamleden hebben geen toegang tot de pagina's van de admin. 


## De mogelijkheden van het platform:
De volgende pagina's zijn beschikbaar:
* Home: Dit is de beginpagina na het inloggen. 
    Hier staan wat links om naar andere pagina's te navigeren. Bovenaan is een navigatiebalk te zien met daarin ook links naar verschillende pagina's.
* Vragenlijsten: Dit is een overzichtspagina van de bestaande vragenlijsten. 
    Door middel van icoontjes in een blok staat aangegeven wat er mee mogelijk is. Zo is het mogelijk om vanaf deze pagina een vragenlijst aan te passen door op het potlood te klikken. Ook is het mogelijk om een vragenlijst te versturen naar teamleden door op het papier te klikken. De prullenbak verwijderd de vragenlijst. als er op het plusje bovenaan geklikt wordt, verschijnt de pagina om een nieuwe vragenlijst aan te maken.  
* Nieuwe vragenlijst: Op deze pagina wordt een nieuwe vragenlijst aangemaakt. 
    Zo is het mogelijk om zelf een vraag te verzinnen, dan wel open of gesloten. Ook is het mogelijk om een al bestaande vraag uit een eerdere vragenlijst te kiezen. Na het opslaan van de vragenlijst verschijnt de overzichtspagina weer. 
* Aanpassen vragenlijst: Op deze pagina kunnen bestaande vragenlijsten worden aangepast. 
    De volgorde van de vragen kan worden veranderd. Ook kunnen er nieuwe vragen worden toegevoegd aan de vragenlijst. 
* Invullen vragenlijst: Om op deze pagina terecht te komen moet de link worden gekopieërd van een al bestaande vragenlijst. 
    Dit kan door op de eerder genoemde knop met het papier te drukken en deze link dan te kopiëren naar de adresbalk. Op deze pagina kan een vragenlijst worden ingevuld en worden opgestuurd door de teamleden. 
* Profiel pagina: Hier staan wat gegevens van de ingelogde admin. 