#Wyszukiwarka zgłoszeń


#Opis

Aplikacja webowa umożliwiająca wyszukiwanie zgłoszeń w bazie danych Firebird. Wyszukiwarka korzysta z technologii Node.js oraz bibliotek express, node-firebird.


#Wymagania

Firebird - należy uruchomić serwer Firebird na porcie 3050 i umieścić plik bazy danych "baza.fdb" na dysku C: bez żadnego katalogu
Node.js - należy zainstalować Node.js na komputerze
Biblioteki Node.js - należy zainstalować biblioteki node-firebird, express i natural


#Instalacja i uruchomienie

Pobierz lub sklonuj repozytorium.
Zainstaluj wymienione wyżej biblioteki Node.js poprzez wykonanie polecenia npm install w katalogu głównym projektu.
Uruchom serwer Firebird na porcie 3050.
Przejdź do katalogu, w którym znajduje się plik server.js.
Uruchom serwer Node.js poprzez wykonanie polecenia w terminalu node server.js.
Otwórz plik index.html w przeglądarce internetowej i rozpocznij korzystanie z wyszukiwarki.
Po kliknięciu kursorem na numer zgłoszenia w wynikach jest on kopiowany do schowka i można go wkleić w wyszukiwarce systemu zgłoszeń.


#Uwagi

Serwer Node.js nasłuchuje domyślnie na porcie 3000.
Aby przetestować działanie wyszukiwarki należy uruchomić lokalnie serwer Firebird na porcie 3050.

