import { CategoryId, Question, StateId } from '@/src/types';

function q(id: string, text: string, options: [string, string, string, string], correctIndex: 0 | 1 | 2 | 3, category: CategoryId, difficulty: 1 | 2 | 3 | 4 | 5, hint: string, explanation: string, stateIds?: StateId[]): Question {
  return { id, text, options, correctIndex, category, difficulty, hint, explanation, stateIds, active: true };
}

const GENERAL_QUESTIONS: Question[] = [
  q('gen-01', 'Wie heißt die Hauptstadt Deutschlands?', ['Berlin', 'Hamburg', 'München', 'Köln'], 0, 'general', 1, 'Sie ist zugleich ein eigenes Bundesland.', 'Berlin ist die Hauptstadt und zugleich eines der 16 Bundesländer.'),
  q('gen-02', 'Wie viele Bundesländer hat Deutschland?', ['12', '14', '16', '18'], 2, 'general', 1, 'Die Zahl ist auch auf der Deutschlandkarte wichtig.', 'Deutschland besteht aus 16 Bundesländern.'),
  q('gen-03', 'Welches chemische Symbol steht für Gold?', ['Ag', 'Au', 'Go', 'Gd'], 1, 'general', 2, 'Das Symbol stammt aus dem Lateinischen.', 'Au leitet sich vom lateinischen Wort „aurum“ für Gold ab.'),
  q('gen-04', 'Wie viele Minuten hat eine Stunde?', ['30', '45', '60', '90'], 2, 'general', 1, 'Eine Stunde besteht aus sechzig gleichen Teilen.', 'Eine Stunde hat 60 Minuten.'),
  q('gen-05', 'Welche Währung wird in Japan verwendet?', ['Won', 'Yen', 'Baht', 'Rupie'], 1, 'general', 2, 'Das Währungssymbol ähnelt einem Y mit zwei Strichen.', 'Die Währung Japans heißt Yen.'),
  q('gen-06', 'Wie viele Seiten hat ein regelmäßiges Hexagon?', ['5', '6', '7', '8'], 1, 'general', 1, '„Hexa“ bedeutet sechs.', 'Ein Hexagon ist ein Sechseck und hat sechs Seiten.'),
  q('gen-07', 'Welcher Ozean ist der größte der Erde?', ['Atlantischer Ozean', 'Indischer Ozean', 'Pazifischer Ozean', 'Arktischer Ozean'], 2, 'general', 2, 'Er liegt zwischen Asien und Amerika.', 'Der Pazifische Ozean ist der größte Ozean der Erde.'),
  q('gen-08', 'Welche Stadt ist für das Oktoberfest bekannt?', ['Dresden', 'München', 'Bonn', 'Rostock'], 1, 'general', 1, 'Die Stadt liegt in Bayern.', 'Das Oktoberfest findet traditionell in München statt.'),
  q('gen-09', 'Wie heißt die Hauptstadt von Frankreich?', ['Lyon', 'Paris', 'Nizza', 'Marseille'], 1, 'general', 1, 'Sie liegt an der Seine.', 'Paris ist die Hauptstadt Frankreichs.'),
  q('gen-10', 'Welche Zahl ist eine Primzahl?', ['21', '27', '29', '33'], 2, 'general', 2, 'Sie ist nur durch 1 und sich selbst teilbar.', '29 hat genau die positiven Teiler 1 und 29 und ist daher eine Primzahl.'),
  q('geo-01', 'Wie heißt der höchste Berg Deutschlands?', ['Feldberg', 'Brocken', 'Zugspitze', 'Watzmann'], 2, 'geography', 1, 'Er liegt an der Grenze zu Österreich.', 'Die Zugspitze ist mit 2.962 Metern der höchste Berg Deutschlands.'),
  q('geo-02', 'An wie viele Staaten grenzt Deutschland?', ['7', '8', '9', '10'], 2, 'geography', 2, 'Zähle die Nachbarländer im Norden, Osten, Süden und Westen.', 'Deutschland hat neun Nachbarstaaten.'),
  q('geo-03', 'Wie heißt die Hauptstadt Bayerns?', ['Nürnberg', 'Augsburg', 'München', 'Regensburg'], 2, 'geography', 1, 'Der FC Bayern ist hier zu Hause.', 'München ist die Landeshauptstadt Bayerns.'),
  q('geo-04', 'Welche ist die größte deutsche Insel?', ['Rügen', 'Usedom', 'Fehmarn', 'Sylt'], 0, 'geography', 2, 'Sie liegt in der Ostsee vor Mecklenburg-Vorpommern.', 'Rügen ist Deutschlands größte Insel.'),
  q('geo-05', 'Welcher Fluss fließt durch Köln?', ['Donau', 'Elbe', 'Rhein', 'Weser'], 2, 'geography', 1, 'Der Kölner Dom steht an seinem Ufer.', 'Der Rhein fließt durch Köln.'),
  q('geo-06', 'An welches Meer grenzt Schleswig-Holstein im Norden und Osten?', ['Nord- und Ostsee', 'Schwarzes und Mittelmeer', 'Ostsee und Atlantik', 'Nordsee und Mittelmeer'], 0, 'geography', 1, 'Das Bundesland liegt zwischen zwei Meeren.', 'Schleswig-Holstein grenzt an Nordsee und Ostsee.'),
  q('geo-07', 'In welcher Himmelsrichtung liegt der Schwarzwald?', ['Nordosten', 'Südwesten', 'Norden', 'Südosten'], 1, 'geography', 2, 'Er liegt in Baden-Württemberg.', 'Der Schwarzwald liegt im Südwesten Deutschlands.'),
  q('geo-08', 'An welchem Fluss liegt Hamburg?', ['Elbe', 'Mosel', 'Oder', 'Lech'], 0, 'geography', 1, 'Der Hamburger Hafen ist ein großer Seehafen an diesem Fluss.', 'Hamburg liegt an der Elbe.'),
  q('geo-09', 'Welches Land liegt östlich von Deutschland?', ['Belgien', 'Frankreich', 'Polen', 'Dänemark'], 2, 'geography', 1, 'Die Hauptstadt ist Warschau.', 'Polen ist ein östlicher Nachbar Deutschlands.'),
  q('geo-10', 'Mit welchen Ländern teilt Deutschland den Bodensee?', ['Frankreich und Luxemburg', 'Österreich und Schweiz', 'Polen und Tschechien', 'Belgien und Niederlande'], 1, 'geography', 2, 'Der See liegt im Süden Deutschlands.', 'Der Bodensee grenzt an Deutschland, Österreich und die Schweiz.'),
  q('hist-01', 'In welchem Jahr fiel die Berliner Mauer?', ['1945', '1961', '1989', '1990'], 2, 'history', 1, 'Das Ereignis geschah am 9. November.', 'Die Berliner Mauer fiel am 9. November 1989.'),
  q('hist-02', 'Wann trat die deutsche Wiedervereinigung in Kraft?', ['3. Oktober 1990', '9. November 1989', '8. Mai 1945', '23. Mai 1949'], 0, 'history', 1, 'Dieser Tag ist heute ein deutscher Feiertag.', 'Am 3. Oktober 1990 wurde die deutsche Einheit vollzogen.'),
  q('hist-03', 'Wer war der erste Bundeskanzler der Bundesrepublik Deutschland?', ['Willy Brandt', 'Konrad Adenauer', 'Helmut Kohl', 'Theodor Heuss'], 1, 'history', 2, 'Er amtierte ab 1949.', 'Konrad Adenauer war der erste Bundeskanzler der Bundesrepublik Deutschland.'),
  q('hist-04', 'In welchem Jahr wurde die Weimarer Republik gegründet?', ['1871', '1919', '1933', '1949'], 1, 'history', 3, 'Die Verfassung wurde nach dem Ersten Weltkrieg beschlossen.', 'Die Weimarer Republik begann 1919.'),
  q('hist-05', 'Welche Erfindung wird Johannes Gutenberg zugeschrieben?', ['Dampfmaschine', 'Buchdruck mit beweglichen Lettern', 'Telefon', 'Fernrohr'], 1, 'history', 2, 'Seine Heimatstadt war Mainz.', 'Gutenberg revolutionierte den Buchdruck mit beweglichen Lettern.'),
  q('hist-06', 'In welcher Stadt wurde das Bauhaus 1919 gegründet?', ['Weimar', 'Berlin', 'Hamburg', 'Dortmund'], 0, 'history', 3, 'Später zog die Schule nach Dessau und Berlin.', 'Walter Gropius gründete das Bauhaus 1919 in Weimar.'),
  q('hist-07', 'In welchem Jahr wurde das Deutsche Kaiserreich gegründet?', ['1648', '1806', '1871', '1918'], 2, 'history', 3, 'Der Zusammenschluss erfolgte nach dem Deutsch-Französischen Krieg.', 'Das Deutsche Kaiserreich wurde 1871 gegründet.'),
  q('hist-08', 'In welchem Jahr endete der Zweite Weltkrieg in Europa?', ['1939', '1943', '1945', '1949'], 2, 'history', 1, 'Das Jahr steht auch auf vielen Gedenktafeln.', 'Der Zweite Weltkrieg endete in Europa 1945.'),
  q('hist-09', 'Wer wurde im Jahr 800 zum Kaiser gekrönt?', ['Otto der Große', 'Karl der Große', 'Friedrich Barbarossa', 'Wilhelm I.'], 1, 'history', 3, 'Die Krönung fand in Rom statt.', 'Karl der Große wurde im Jahr 800 zum Kaiser gekrönt.'),
  q('hist-10', 'Welche Konferenz fand 1945 in Potsdam statt?', ['Potsdamer Konferenz', 'Wiener Kongress', 'Münchner Konferenz', 'Haager Konferenz'], 0, 'history', 2, 'Sie behandelte die Nachkriegsordnung Europas.', 'Die Potsdamer Konferenz fand im Sommer 1945 statt.'),
  q('sci-01', 'Welche Form hat das Erbmolekül DNA?', ['Einzelhelix', 'Doppelhelix', 'Dreifachring', 'Würfelstruktur'], 1, 'science', 1, 'Zwei Stränge winden sich umeinander.', 'DNA ist als Doppelhelix aufgebaut.'),
  q('sci-02', 'Bei welcher Temperatur siedet Wasser auf Meereshöhe?', ['0 °C', '50 °C', '100 °C', '212 °C'], 2, 'science', 1, 'Die Zahl ist auch in Fahrenheit bekannt.', 'Wasser siedet auf Meereshöhe bei 100 °C.'),
  q('sci-03', 'Wie viele Planeten hat unser Sonnensystem?', ['7', '8', '9', '10'], 1, 'science', 1, 'Pluto wird heute als Zwergplanet eingeordnet.', 'Unser Sonnensystem hat acht Planeten.'),
  q('sci-04', 'Welche Einheit misst elektrische Stromstärke?', ['Volt', 'Watt', 'Ampere', 'Ohm'], 2, 'science', 2, 'Die Einheit ist nach einem französischen Physiker benannt.', 'Die elektrische Stromstärke wird in Ampere gemessen.'),
  q('sci-05', 'In welchem Jahr landeten erstmals Menschen auf dem Mond?', ['1959', '1969', '1979', '1989'], 1, 'science', 1, 'Apollo 11 machte die Mission möglich.', 'Die erste bemannte Mondlandung fand 1969 statt.'),
  q('sci-06', 'Welche Energiequelle nutzt Sonnenlicht direkt?', ['Solarenergie', 'Geothermie', 'Wasserkraft', 'Biomasse'], 0, 'science', 1, 'Photovoltaik ist eine Form davon.', 'Solarenergie wandelt die Strahlung der Sonne in nutzbare Energie um.'),
  q('sci-07', 'Welche beiden Ziffern verwendet das Binärsystem?', ['1 und 2', '0 und 1', '2 und 3', '0 und 9'], 1, 'science', 1, 'Computer rechnen mit zwei Zuständen.', 'Das Binärsystem verwendet ausschließlich 0 und 1.'),
  q('sci-08', 'Welche Kraft zieht Gegenstände zur Erde?', ['Magnetismus', 'Reibung', 'Gravitation', 'Auftrieb'], 2, 'science', 1, 'Sie hält uns auf dem Boden.', 'Die Gravitation zieht Massen gegenseitig an.'),
  q('sci-09', 'Welche Technik nutzt starke Magnetfelder und Radiowellen für Bilder aus dem Körper?', ['MRT', 'EKG', 'Ultraschall', 'Röntgenfluoreszenz'], 0, 'science', 3, 'Die Abkürzung steht für Magnetresonanztomografie.', 'MRT steht für Magnetresonanztomografie.'),
  q('sci-10', 'Wie lautet der gebräuchliche Name von Ascorbinsäure?', ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'], 1, 'science', 2, 'Zitrusfrüchte enthalten davon viel.', 'Ascorbinsäure ist Vitamin C.'),
  q('cult-01', 'In welcher Sportart wurde Deutschland 2014 Weltmeister?', ['Basketball', 'Fußball', 'Handball', 'Eishockey'], 1, 'culture', 1, 'Das Finale fand in Rio de Janeiro statt.', 'Deutschland gewann 2014 die Fußball-Weltmeisterschaft.'),
  q('cult-02', 'Wer schrieb das Drama „Faust“?', ['Johann Wolfgang von Goethe', 'Friedrich Schiller', 'Bertolt Brecht', 'Thomas Mann'], 0, 'culture', 1, 'Der Autor wurde 1749 in Frankfurt geboren.', '„Faust“ ist eines der bekanntesten Werke Goethes.'),
  q('cult-03', 'In welcher deutschen Stadt wurde Ludwig van Beethoven geboren?', ['Bonn', 'Leipzig', 'Weimar', 'Kiel'], 0, 'culture', 2, 'Sein Geburtshaus steht am Bonngasse.', 'Beethoven wurde in Bonn geboren.'),
  q('cult-04', 'Wessen Melodie bildet die Grundlage der deutschen Europahymne?', ['Johann Sebastian Bach', 'Ludwig van Beethoven', 'Joseph Haydn', 'Richard Wagner'], 1, 'culture', 2, 'Sie stammt aus der 9. Sinfonie.', 'Die Europahymne verwendet Beethovens „Ode an die Freude“.'),
  q('cult-05', 'In welcher Stadt findet die documenta statt?', ['Kassel', 'Ulm', 'Rostock', 'Aachen'], 0, 'culture', 2, 'Die Stadt liegt in Hessen.', 'Die documenta ist eine große Ausstellung für zeitgenössische Kunst in Kassel.'),
  q('cult-06', 'Wie viele Spieler stehen beim Handball pro Mannschaft normalerweise auf dem Feld?', ['5', '6', '7', '11'], 2, 'culture', 1, 'Ein Torwart gehört dazu.', 'Im Hallenhandball spielen sieben Personen pro Team auf dem Feld.'),
  q('cult-07', 'Wer gründete das Bauhaus?', ['Walter Gropius', 'Albert Einstein', 'Max Planck', 'Karl May'], 0, 'culture', 2, 'Der Architekt leitete die Schule zuerst.', 'Walter Gropius gründete das Bauhaus 1919.'),
  q('cult-08', 'Wie heißt das bekannte internationale Filmfestival in Berlin?', ['Berlinale', 'Cannes', 'Locarno', 'Biennale'], 0, 'culture', 1, 'Sein Hauptpreis heißt Goldener Bär.', 'Die Berlinale ist das internationale Filmfestival Berlins.'),
  q('cult-09', 'Zu welcher Sportart gehört die Tour de France?', ['Radsport', 'Tennis', 'Rudern', 'Leichtathletik'], 0, 'culture', 1, 'Die Teilnehmer fahren in Etappen.', 'Die Tour de France ist ein großes Straßenradrennen.'),
  q('cult-10', 'Was bedeutet eine rote Karte im Fußball?', ['Eckball', 'Auswechslung ohne Folgen', 'Platzverweis', 'Halbzeit'], 2, 'culture', 1, 'Der Spieler muss das Spielfeld verlassen.', 'Eine rote Karte führt zum Platzverweis.'),
];

const LOCAL_QUESTIONS: Question[] = [
  q('hh-01', 'Welcher Fluss prägt den Hamburger Hafen?', ['Elbe', 'Rhein', 'Oder', 'Isar'], 0, 'local', 1, 'Er fließt von Tschechien bis zur Nordsee.', 'Der Hamburger Hafen liegt an der Elbe.', ['HH']),
  q('hh-02', 'Wie heißt Hamburgs bekanntes Lagerhausviertel?', ['Speicherstadt', 'Grindelviertel', 'Schnoor', 'Nikolaiviertel'], 0, 'local', 1, 'Viele Backsteingebäude stehen dort dicht an den Fleeten.', 'Die Speicherstadt ist ein Wahrzeichen Hamburgs und Teil des UNESCO-Welterbes.', ['HH']),
  q('hh-03', 'Welcher Hamburger Stadtteil ist für die Reeperbahn bekannt?', ['Altona', 'St. Pauli', 'Blankenese', 'Bergedorf'], 1, 'local', 1, 'Der Stadtteil liegt nahe dem Hafen.', 'Die Reeperbahn liegt im Hamburger Stadtteil St. Pauli.', ['HH']),
  q('hh-04', 'Wie heißt Hamburgs berühmte Kirche mit dem Spitznamen „Michel“?', ['St. Michaelis', 'St. Nikolai', 'St. Petri', 'St. Jacobi'], 0, 'local', 1, 'Der vollständige Name beginnt mit St. Michael…', '„Michel“ ist der geläufige Name der Hauptkirche St. Michaelis.', ['HH']),
  q('hh-05', 'Welche Freizeitattraktion zeigt eine riesige Miniaturwelt in der Speicherstadt?', ['Miniatur Wunderland', 'Planetarium Nord', 'Dungeon Hamburg', 'Dialoghaus'], 0, 'local', 1, 'Sie gilt als eine der beliebtesten Sehenswürdigkeiten der Stadt.', 'Das Miniatur Wunderland befindet sich in der Speicherstadt.', ['HH']),
  q('hh-06', 'Wie heißt Hamburgs großer Binnensee im Stadtzentrum?', ['Alster', 'Wannsee', 'Maschsee', 'Chiemsee'], 0, 'local', 1, 'Er besteht aus Binnen- und Außenalster.', 'Die Alster prägt das Zentrum Hamburgs.', ['HH']),
  q('hh-07', 'Welche Stadt ist Hamburg politisch und geografisch?', ['Ein Landkreis', 'Ein Stadtstaat', 'Eine Inselrepublik', 'Eine kreisfreie Gemeinde in Bayern'], 1, 'local', 2, 'Berlin und Bremen gehören ebenfalls zu dieser Gruppe.', 'Hamburg ist eines der drei deutschen Stadtstaaten.', ['HH']),
  q('hh-08', 'Wie lautet der internationale Flughafencode von Hamburg?', ['HAM', 'HBG', 'HHA', 'HMB'], 0, 'local', 2, 'Er besteht aus den ersten und letzten Buchstaben des Stadtnamens.', 'Der IATA-Code des Hamburger Flughafens lautet HAM.', ['HH']),
  q('hh-09', 'Welches Fest wird jährlich rund um den Hamburger Hafen gefeiert?', ['Hafengeburtstag', 'Kieler Woche', 'Rhein in Flammen', 'Drachenstich'], 0, 'local', 1, 'Der Name verweist direkt auf den Hafen.', 'Der Hamburger Hafengeburtstag ist ein großes maritimes Stadtfest.', ['HH']),
  q('hh-10', 'Zu welchem UNESCO-Welterbe gehört die Hamburger Speicherstadt seit 2015?', ['Speicherstadt und Kontorhausviertel', 'Wartburg und Weimar', 'Museumsinsel und Sanssouci', 'Völklinger Hütte und Dom'], 0, 'local', 3, 'Auch das Chilehaus ist Teil des Ensembles.', 'Das Welterbe umfasst die Speicherstadt und das Kontorhausviertel mit dem Chilehaus.', ['HH']),
  q('ni-01', 'Wie heißt die Landeshauptstadt Niedersachsens?', ['Hannover', 'Braunschweig', 'Oldenburg', 'Göttingen'], 0, 'local', 1, 'Die Stadt ist auch Gastgeberin einer großen Messe.', 'Hannover ist die Landeshauptstadt Niedersachsens.', ['NI']),
  q('ni-02', 'Welcher Naturraum an der niedersächsischen Küste gehört zum Wattenmeer?', ['Nationalpark Niedersächsisches Wattenmeer', 'Bayerischer Wald', 'Harzvorland', 'Spreewald'], 0, 'local', 2, 'Bei Ebbe fällt der Meeresboden trocken.', 'Das Niedersächsische Wattenmeer ist Teil des Wattenmeer-Naturraums.', ['NI']),
  q('ni-03', 'In welcher niedersächsischen Stadt hat Volkswagen seinen Stammsitz?', ['Wolfsburg', 'Celle', 'Hildesheim', 'Osnabrück'], 0, 'local', 1, 'Die Stadt wurde eng mit dem Autowerk verbunden.', 'Volkswagen hat seinen Stammsitz in Wolfsburg.', ['NI']),
  q('ni-04', 'Welche Landschaft ist für ihre violett blühende Heide bekannt?', ['Lüneburger Heide', 'Eifel', 'Schwäbische Alb', 'Uckermark'], 0, 'local', 1, 'Sie liegt südlich von Hamburg.', 'Die Lüneburger Heide ist eine bekannte Kulturlandschaft Niedersachsens.', ['NI']),
  q('ni-05', 'Wie heißen die Inseln vor der niedersächsischen Nordseeküste?', ['Ostfriesische Inseln', 'Halligen von Rügen', 'Bodenseeinseln', 'Usedomer Inseln'], 0, 'local', 1, 'Sie liegen zwischen Ems und Jade.', 'Die Ostfriesischen Inseln liegen vor der niedersächsischen Küste.', ['NI']),
  q('ni-06', 'Welche große Messe ist eng mit Hannover verbunden?', ['Hannover Messe', 'Buchmesse Leipzig', 'Gamescom', 'Grüne Woche Berlin'], 0, 'local', 1, 'Sie ist vor allem für Industrie und Technik bekannt.', 'Die Hannover Messe ist eine internationale Industriemesse.', ['NI']),
  q('ni-07', 'Welche Stadt ist für ihre historischen Herrenhäuser Gärten bekannt?', ['Hannover', 'Lingen', 'Cuxhaven', 'Goslar'], 0, 'local', 2, 'Die Gärten liegen im Westen der Landeshauptstadt.', 'Die Herrenhäuser Gärten zählen zu den bekanntesten Sehenswürdigkeiten Hannovers.', ['NI']),
  q('ni-08', 'Welche Stadt ist besonders eng mit der Salzgewinnung verbunden?', ['Lüneburg', 'Wilhelmshaven', 'Hameln', 'Leer'], 0, 'local', 2, 'Die Stadt wurde durch eine mittelalterliche Saline reich.', 'Lüneburgs Geschichte ist eng mit der Salzgewinnung verbunden.', ['NI']),
  q('ni-09', 'An welches Meer grenzt Niedersachsen?', ['Nordsee', 'Ostsee', 'Mittelmeer', 'Schwarzes Meer'], 0, 'local', 1, 'Die Küste liegt im Nordwesten.', 'Niedersachsen besitzt eine Küste an der Nordsee.', ['NI']),
  q('ni-10', 'Welche Gebirgsregion liegt teilweise in Niedersachsen?', ['Harz', 'Alpen', 'Erzgebirge', 'Bayerischer Wald'], 0, 'local', 1, 'Der Brocken ist der bekannteste Gipfel der Region.', 'Der Harz liegt unter anderem in Niedersachsen.', ['NI']),
  q('sh-01', 'Wie heißt die Landeshauptstadt Schleswig-Holsteins?', ['Kiel', 'Lübeck', 'Flensburg', 'Neumünster'], 0, 'local', 1, 'Die Stadt liegt an der Kieler Förde.', 'Kiel ist die Landeshauptstadt Schleswig-Holsteins.', ['SH']),
  q('sh-02', 'Zwischen welchen zwei Meeren liegt Schleswig-Holstein?', ['Nordsee und Ostsee', 'Atlantik und Mittelmeer', 'Ostsee und Schwarzes Meer', 'Nordsee und Adria'], 0, 'local', 1, 'Das ist ein zentraler Teil des Landesmottos.', 'Schleswig-Holstein liegt zwischen Nordsee und Ostsee.', ['SH']),
  q('sh-03', 'Welche Insel ist für ihren langen Sandstrand und die „Sansibar“ bekannt?', ['Sylt', 'Rügen', 'Fehmarn', 'Borkum'], 0, 'local', 1, 'Sie liegt vor der nordfriesischen Küste.', 'Sylt ist eine bekannte nordfriesische Insel.', ['SH']),
  q('sh-04', 'Welche Stadt ist für das Holstentor bekannt?', ['Lübeck', 'Kiel', 'Husum', 'Eutin'], 0, 'local', 1, 'Das Tor gehört zur historischen Altstadt.', 'Das Holstentor steht in Lübeck.', ['SH']),
  q('sh-05', 'Wie heißt die große Segelveranstaltung in Kiel?', ['Kieler Woche', 'Travemünder Woche', 'Hanse Sail', 'Nordseewoche'], 0, 'local', 1, 'Sie findet jährlich im Sommer statt.', 'Die Kieler Woche ist eine internationale Segel- und Kulturveranstaltung.', ['SH']),
  q('sh-06', 'Welche Insel liegt östlich von Schleswig-Holstein in der Ostsee?', ['Fehmarn', 'Norderney', 'Borkum', 'Amrum'], 0, 'local', 2, 'Sie ist über eine Brücke mit dem Festland verbunden.', 'Fehmarn liegt in der Ostsee vor der schleswig-holsteinischen Küste.', ['SH']),
  q('sh-07', 'Welcher Nationalpark schützt große Teile des Wattenmeers in Schleswig-Holstein?', ['Nationalpark Schleswig-Holsteinisches Wattenmeer', 'Nationalpark Harz', 'Nationalpark Jasmund', 'Nationalpark Eifel'], 0, 'local', 2, 'Er liegt an der Nordseeküste.', 'Der Nationalpark Schleswig-Holsteinisches Wattenmeer schützt diesen Küstenraum.', ['SH']),
  q('sh-08', 'Welche Stadt liegt an der Flensburger Förde?', ['Flensburg', 'Itzehoe', 'Ratzeburg', 'Mölln'], 0, 'local', 1, 'Die Stadt liegt nahe der dänischen Grenze.', 'Flensburg liegt an der Flensburger Förde.', ['SH']),
  q('sh-09', 'Welche Landschaft wird auch „Holsteinische Schweiz“ genannt?', ['Hügellandschaft in Ostholstein', 'Hochgebirge in Südtirol', 'Moorlandschaft bei Bremen', 'Weinregion am Rhein'], 0, 'local', 2, 'Sie ist für Seen und sanfte Hügel bekannt.', 'Die Holsteinische Schweiz ist eine seenreiche Hügellandschaft in Ostholstein.', ['SH']),
  q('sh-10', 'Zu welchem Bundesland gehört die Insel Helgoland?', ['Schleswig-Holstein', 'Niedersachsen', 'Mecklenburg-Vorpommern', 'Hamburg'], 0, 'local', 1, 'Sie liegt weit vor der deutschen Nordseeküste.', 'Helgoland gehört zum Kreis Pinneberg in Schleswig-Holstein.', ['SH']),
];

export const QUESTIONS: Question[] = [...GENERAL_QUESTIONS, ...LOCAL_QUESTIONS];
export const FINAL_POOL = GENERAL_QUESTIONS;
export const QUICK_POOL = GENERAL_QUESTIONS;

export function getCategoryQuestions(stateId: StateId, category: CategoryId): Question[] {
  return QUESTIONS.filter((question) => question.category === category && (!question.stateIds || question.stateIds.includes(stateId)));
}

export function findQuestion(id: string): Question | undefined {
  return QUESTIONS.find((question) => question.id === id);
}

export function questionBankByCategory(): Record<CategoryId, Question[]> {
  return QUESTIONS.reduce((result, question) => {
    result[question.category] = [...(result[question.category] ?? []), question];
    return result;
  }, {} as Record<CategoryId, Question[]>);
}
