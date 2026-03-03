DELETE FROM test_pi.stops;
DELETE FROM test_pi.participants;

-- insertions des participants
INSERT INTO test_pi.participants(
	participant_id, prenom, nom)
	VALUES (8, 'Jean', 'DUPONT');

INSERT INTO test_pi.participants(
	participant_id, prenom, nom)
	VALUES (12, 'Marie', 'DURAND');


INSERT INTO test_pi.participants(
	participant_id, prenom, nom)
	VALUES (14, 'Shopie', 'DOE');

INSERT INTO test_pi.participants(
	participant_id, prenom, nom)
	VALUES (16, 'Max', 'ZORAUD');

-- insertion des stops
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-08 16:09:09',  '2019-07-08 17:04:27' , ST_GeomFromText('POINT(5.7166925858132 45.1850182848391)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-08 17:10:02',  '2019-07-08 17:34:57' , ST_GeomFromText('POINT(5.72051221975029 45.1852255146285)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-08 17:41:17',  '2019-07-09 05:49:28' , ST_GeomFromText('POINT(5.71696620975582 45.185100455783)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 05:57:43',  '2019-07-09 05:59:13' , ST_GeomFromText('POINT(5.71366362803744 45.1882267810594)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 06:27:33',  '2019-07-09 07:06:19' , ST_GeomFromText('POINT(5.77262602924874 45.189197168643)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 07:10:49',  '2019-07-09 10:25:39' , ST_GeomFromText('POINT(5.77257225734994 45.1894414557522)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 10:30:19',  '2019-07-09 11:19:29' , ST_GeomFromText('POINT(5.77125659451114 45.1923209534638)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 11:23:29',  '2019-07-09 11:34:29' , ST_GeomFromText('POINT(5.77282406676964 45.1892663225319)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 12:40:54',  '2019-07-09 14:39:33' , ST_GeomFromText('POINT(5.77293513741219 45.1891052861795)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 14:42:08',  '2019-07-09 14:54:13' , ST_GeomFromText('POINT(5.77247808267977 45.1896449540608)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 14:55:03',  '2019-07-09 16:03:30' , ST_GeomFromText('POINT(5.7729939218137 45.1889888672788)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 16:06:15',  '2019-07-09 16:10:55' , ST_GeomFromText('POINT(5.77274974833853 45.1887197791281)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 16:13:10',  '2019-07-09 16:20:55' , ST_GeomFromText('POINT(5.77262693349703 45.1885222196256)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 16:25:10',  '2019-07-09 16:25:40' , ST_GeomFromText('POINT(5.77367833333333 45.1888499999999)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 16:33:25',  '2019-07-09 16:34:40' , ST_GeomFromText('POINT(5.74674500201591 45.188137540964)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 16:42:40',  '2019-07-09 16:42:45' , ST_GeomFromText('POINT(5.72365416666667 45.1809566666666)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 17:28:00',  '2019-07-09 17:28:15' , ST_GeomFromText('POINT(5.72419000000045 45.1869433333334)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 17:34:50',  '2019-07-09 18:14:39' , ST_GeomFromText('POINT(5.72395996067204 45.1870700426155)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 06:56:05',  '2019-07-10 06:57:50' , ST_GeomFromText('POINT(5.7228769456165 45.1808407043092)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 06:59:10',  '2019-07-10 08:08:38' , ST_GeomFromText('POINT(5.72482518424873 45.17933544141)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 08:13:38',  '2019-07-10 08:16:18' , ST_GeomFromText('POINT(5.71706220611956 45.1853044156543)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 08:16:38',  '2019-07-10 10:43:44' , ST_GeomFromText('POINT(5.71630679021281 45.1850599564324)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 11:33:35',  '2019-07-10 11:34:00' , ST_GeomFromText('POINT(5.72191333331901 45.1850283333349)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 11:38:20',  '2019-07-10 13:47:35' , ST_GeomFromText('POINT(5.71656632840634 45.185018426225)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 14:01:35',  '2019-07-10 14:32:45' , ST_GeomFromText('POINT(5.70768272779825 45.1724360833667)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 14:36:35',  '2019-07-10 15:31:30' , ST_GeomFromText('POINT(5.70831833302529 45.17042000033)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 15:33:15',  '2019-07-10 16:27:23' , ST_GeomFromText('POINT(5.70891716338241 45.1719547848063)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 16:30:28',  '2019-07-10 16:31:08' , ST_GeomFromText('POINT(5.71416678893327 45.1744041816325)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 16:36:13',  '2019-07-10 17:09:28' , ST_GeomFromText('POINT(5.72572051888028 45.1753998244923)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 17:16:08',  '2019-07-10 17:38:49' , ST_GeomFromText('POINT(5.71641073215477 45.185029130375)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 17:47:14',  '2019-07-10 17:49:09' , ST_GeomFromText('POINT(5.71591434549307 45.180434508951)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 18:00:04',  '2019-07-10 20:05:24' , ST_GeomFromText('POINT(5.73611207451587 45.183088331879)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 20:06:24',  '2019-07-10 20:14:19' , ST_GeomFromText('POINT(5.73589157175293 45.1833660729874)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-10 20:19:24',  '2019-07-10 20:23:49' , ST_GeomFromText('POINT(5.73184670458463 45.1841369687546)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-11 06:35:04',  '2019-07-11 10:07:40' , ST_GeomFromText('POINT(5.77352131460993 45.1889331301462)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-11 10:23:35',  '2019-07-11 11:44:45' , ST_GeomFromText('POINT(5.69013939781186 45.1625933076671)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-11 11:47:05',  '2019-07-11 11:47:25' , ST_GeomFromText('POINT(5.68904193229289 45.1653671824435)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-11 11:59:45',  '2019-07-11 16:43:40' , ST_GeomFromText('POINT(5.77379644284539 45.1891340325698)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-11 17:03:05',  '2019-07-11 17:03:55' , ST_GeomFromText('POINT(5.72806139091387 45.1903426917326)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-11 17:11:10',  '2019-07-11 17:11:50' , ST_GeomFromText('POINT(5.71509666666667 45.1911466666666)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-11 17:21:40',  '2019-07-11 18:13:05' , ST_GeomFromText('POINT(5.71684883759189 45.1850749082639)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-11 18:23:35',  '2019-07-11 21:53:00' , ST_GeomFromText('POINT(5.70990103969593 45.1894217503441)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-12 06:16:55',  '2019-07-12 06:17:50' , ST_GeomFromText('POINT(5.72527916964327 45.1751533943145)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-12 06:37:05',  '2019-07-12 10:53:01' , ST_GeomFromText('POINT(5.77293796155932 45.18901461047)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-12 10:56:06',  '2019-07-12 11:02:01' , ST_GeomFromText('POINT(5.772867826602 45.187618563453)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-12 11:08:36',  '2019-07-12 11:50:21' , ST_GeomFromText('POINT(5.76780456512311 45.190971505343)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-12 11:57:11',  '2019-07-12 12:09:51' , ST_GeomFromText('POINT(5.77211715831928 45.1891081141633)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-12 12:12:11',  '2019-07-12 13:51:27' , ST_GeomFromText('POINT(5.77272830366055 45.1890498967705)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-12 13:53:32',  '2019-07-12 14:41:02' , ST_GeomFromText('POINT(5.77310163349206 45.1889241208919)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-12 14:43:02',  '2019-07-12 15:10:17' , ST_GeomFromText('POINT(5.77311105556647 45.1891374894119)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-12 15:36:32',  '2019-07-12 15:40:52' , ST_GeomFromText('POINT(5.71337846724749 45.1879596670883)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-15 09:55:57',  '2019-07-15 10:50:27' , ST_GeomFromText('POINT(5.72803588145959 45.1656059851051)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-15 10:53:17',  '2019-07-15 11:01:37' , ST_GeomFromText('POINT(5.72791750423841 45.1649494905371)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-15 16:38:52',  '2019-07-15 16:43:17' , ST_GeomFromText('POINT(5.83431963283537 45.1643658503876)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-15 16:47:52',  '2019-07-15 16:50:12' , ST_GeomFromText('POINT(5.83831599305038 45.152189514641)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-15 16:53:37',  '2019-07-15 18:35:32' , ST_GeomFromText('POINT(5.83424400800693 45.1644428716375)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-16 06:27:59',  '2019-07-16 08:39:03' , ST_GeomFromText('POINT(5.76566009402092 45.2028810167932)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-16 08:40:08',  '2019-07-16 08:40:33' , ST_GeomFromText('POINT(5.76544366639124 45.2027783870071)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-16 08:58:18',  '2019-07-16 10:46:03' , ST_GeomFromText('POINT(5.72850156458266 45.1658726429987)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-16 11:40:33',  '2019-07-16 12:11:18' , ST_GeomFromText('POINT(5.72778024313083 45.1652940937385)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-16 12:13:03',  '2019-07-16 15:52:09' , ST_GeomFromText('POINT(5.72778050939038 45.1655528280306)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-16 16:17:46',  '2019-07-17 06:33:10' , ST_GeomFromText('POINT(5.83436784345506 45.1644305994531)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-17 06:37:50',  '2019-07-17 06:59:40' , ST_GeomFromText('POINT(5.83829991994574 45.1521492581115)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-17 07:17:35',  '2019-07-17 07:18:00' , ST_GeomFromText('POINT(5.76677567647859 45.1896785024696)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-17 10:01:14',  '2019-07-17 10:08:39' , ST_GeomFromText('POINT(5.77191208759046 45.1916245327132)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-17 10:13:59',  '2019-07-17 16:12:12' , ST_GeomFromText('POINT(5.76754538053885 45.1909782294782)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-17 16:31:27',  '2019-07-18 06:37:07' , ST_GeomFromText('POINT(5.83437338681285 45.1644673870261)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-18 07:01:27',  '2019-07-18 07:04:17' , ST_GeomFromText('POINT(5.73292830236252 45.1856727007812)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-18 17:33:16',  '2019-07-18 17:33:36' , ST_GeomFromText('POINT(5.72340651214477 45.1877384997639)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-18 17:36:56',  '2019-07-18 17:42:21' , ST_GeomFromText('POINT(5.72509787844305 45.1900048499387)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-18 18:03:31',  '2019-07-18 18:03:56' , ST_GeomFromText('POINT(5.76795742699217 45.1897535278754)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-18 18:18:21',  '2019-07-19 05:54:36' , ST_GeomFromText('POINT(5.83429690290351 45.1644274035898)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-19 06:11:26',  '2019-07-19 08:19:35' , ST_GeomFromText('POINT(5.76674124101645 45.1905744592786)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-19 08:24:04',  '2019-07-19 10:54:32' , ST_GeomFromText('POINT(5.77207391376557 45.1894269102994)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-19 11:00:07',  '2019-07-19 11:03:02' , ST_GeomFromText('POINT(5.77268595753979 45.1901413737886)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-19 11:07:57',  '2019-07-19 11:37:37' , ST_GeomFromText('POINT(5.77148144946526 45.1920256261008)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-19 16:07:31',  '2019-07-19 16:17:11' , ST_GeomFromText('POINT(5.76645776536895 45.190635208202)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-19 16:18:41',  '2019-07-19 17:49:24' , ST_GeomFromText('POINT(5.76169308113711 45.1895082364833)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-19 18:04:49',  '2019-07-19 19:48:29' , ST_GeomFromText('POINT(5.83443062959132 45.1643864871516)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-08 05:17:16',  '2019-07-08 05:29:31' , ST_GeomFromText('POINT(5.71689154688196 45.1849946597699)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-08 05:36:41',  '2019-07-08 05:39:21' , ST_GeomFromText('POINT(5.7289431805441 45.1737452075261)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-08 05:56:41',  '2019-07-08 06:04:21' , ST_GeomFromText('POINT(5.77295349386877 45.1889906246451)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-08 10:55:15',  '2019-07-08 11:16:15' , ST_GeomFromText('POINT(5.77115677840951 45.1925698672827)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-08 11:21:40',  '2019-07-08 11:46:18' , ST_GeomFromText('POINT(5.77290459597042 45.1892810556518)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-08 11:58:38',  '2019-07-08 14:20:02' , ST_GeomFromText('POINT(5.76541811430036 45.1933339129744)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-08 14:30:37',  '2019-07-08 15:41:54' , ST_GeomFromText('POINT(5.77243853377625 45.1895800448317)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-09 16:52:25',  '2019-07-09 17:18:25' , ST_GeomFromText('POINT(5.71665305190583 45.1850280730633)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (8, '2019-07-11 22:05:40',  '2019-07-12 06:10:55' , ST_GeomFromText('POINT(5.71700516864772 45.1852362847382)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-18 07:12:17',  '2019-07-18 08:37:07' , ST_GeomFromText('POINT(5.7268741811948 45.1654190669728)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-18 08:45:07',  '2019-07-18 08:46:27' , ST_GeomFromText('POINT(5.7276517372764 45.1638222314814)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-18 08:50:57',  '2019-07-18 09:57:41' , ST_GeomFromText('POINT(5.72692536317503 45.1654426727212)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-18 10:26:39',  '2019-07-18 12:36:44' , ST_GeomFromText('POINT(5.72809233080316 45.1655369805939)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-18 12:53:54',  '2019-07-18 13:14:54' , ST_GeomFromText('POINT(5.76770872436248 45.1898205279708)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-18 13:17:04',  '2019-07-18 16:21:51' , ST_GeomFromText('POINT(5.76674463778583 45.1904643598697)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-18 16:31:41',  '2019-07-18 16:33:11' , ST_GeomFromText('POINT(5.73428943316912 45.1863350955432)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-18 16:39:21',  '2019-07-18 16:40:16' , ST_GeomFromText('POINT(5.72560500000005 45.1848641666667)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-18 16:45:31',  '2019-07-18 16:45:31' , ST_GeomFromText('POINT(5.71842666666667 45.1859683333333)', 4326));
INSERT into test_pi.stops(participant_id, date_debut, date_fin, geom) values (12, '2019-07-18 16:48:11',  '2019-07-18 17:27:41' , ST_GeomFromText('POINT(5.72036117580559 45.1855267192513)', 4326));

