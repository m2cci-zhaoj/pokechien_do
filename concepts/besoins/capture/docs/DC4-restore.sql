--
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.23
-- Dumped by pg_dump version 9.6.23

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.stop_mbgp DROP CONSTRAINT fk_stop_deplacement;
ALTER TABLE ONLY public.stop_mbgp DROP CONSTRAINT fk_stop_activite;
ALTER TABLE ONLY public.pm_concentration DROP CONSTRAINT fk_pm_stops;
ALTER TABLE ONLY public.pm_concentration DROP CONSTRAINT fk_pm_moves;
ALTER TABLE ONLY public.pm_concentration DROP CONSTRAINT fk_pm_deplacement;
ALTER TABLE ONLY public.pm_concentration DROP CONSTRAINT fk_pm_activite;
ALTER TABLE ONLY public.move_mbgp DROP CONSTRAINT fk_move_deplacement;
ALTER TABLE ONLY public.move_mbgp DROP CONSTRAINT fk_move_activite;
ALTER TABLE ONLY public.carnet_activite DROP CONSTRAINT fk_carnet_act_poi;
ALTER TABLE ONLY public.stop_mbgp DROP CONSTRAINT stop_mbgp_pkey;
ALTER TABLE ONLY public.pm_concentration DROP CONSTRAINT pm_concentration_pkey;
ALTER TABLE ONLY public.move_mbgp DROP CONSTRAINT move_mbgp_pkey;
ALTER TABLE ONLY public.mesure_gps DROP CONSTRAINT mesure_gps_pkey;
ALTER TABLE ONLY public.carnet_poi DROP CONSTRAINT carnet_poi_pkey;
ALTER TABLE ONLY public.carnet_deplacement DROP CONSTRAINT carnet_deplacement_pkey;
ALTER TABLE ONLY public.carnet_activite DROP CONSTRAINT carnet_activite_pkey;
ALTER TABLE public.stop_mbgp ALTER COLUMN i_stop_id DROP DEFAULT;
ALTER TABLE public.pm_concentration ALTER COLUMN i_pm_id DROP DEFAULT;
ALTER TABLE public.move_mbgp ALTER COLUMN i_move_id DROP DEFAULT;
DROP SEQUENCE public.stop_mbgp_i_stop_id_seq;
DROP TABLE public.stop_mbgp;
DROP SEQUENCE public.pm_concentration_i_pm_id_seq;
DROP TABLE public.pm_concentration;
DROP SEQUENCE public.move_mbgp_i_move_id_seq;
DROP TABLE public.move_mbgp;
DROP TABLE public.mesure_gps;
DROP TABLE public.carnet_poi;
DROP TABLE public.carnet_deplacement;
DROP TABLE public.carnet_activite;
DROP EXTENSION adminpack;
DROP EXTENSION plpgsql;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: carnet_activite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carnet_activite (
    i_id_carnet_a integer NOT NULL,
    i_id_pers_session smallint,
    i_id_act_jour smallint,
    dt_start_act_utc timestamp with time zone,
    dt_end_act_utc timestamp with time zone,
    i_duree_mins real,
    i_code_act smallint,
    s_code_poi character(1),
    s_non_poi text
);


ALTER TABLE public.carnet_activite OWNER TO postgres;

--
-- Name: carnet_deplacement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carnet_deplacement (
    i_id_carnet_d integer NOT NULL,
    i_id_pers_session smallint,
    i_id_dep_jour smallint,
    dt_start_dep_utc integer,
    dt_end_dep_utc integer,
    i_duree_mins real,
    s_mode_dep character varying(15),
    b_dep_loisir boolean,
    i_enf_menage smallint,
    i_enf_autre smallint,
    i_adul_menage smallint,
    i_adul_autre smallint
);


ALTER TABLE public.carnet_deplacement OWNER TO postgres;

--
-- Name: carnet_poi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carnet_poi (
    i_id_poi integer NOT NULL,
    i_id_pers_session smallint NOT NULL,
    s_code_poi character(1) NOT NULL,
    s_nom_poi text,
    i_num_rue smallint,
    s_nom_rue text,
    i_code_postal integer,
    s_nom_com text,
    s_information text,
    s_obs_enq text,
    s_obs_saisie text
);


ALTER TABLE public.carnet_poi OWNER TO postgres;

--
-- Name: mesure_gps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mesure_gps (
    i_pid bigint NOT NULL,
    i_id_pers_session smallint,
    i_id_pers smallint,
    i_id_session smallint,
    i_ts bigint,
    dt_ts_utc timestamp with time zone,
    r_lat double precision,
    r_long double precision,
    r_speed double precision,
    r_course double precision,
    s_mode character varying(3),
    s_fix character varying(3),
    i_alt smallint,
    s_mode1 character varying(3),
    i_mode2 integer,
    i_sat_used smallint,
    r_pdop double precision,
    r_hdop double precision,
    r_vdop double precision,
    i_sat_in_view smallint,
    geom_2154 text
);


ALTER TABLE public.mesure_gps OWNER TO postgres;

--
-- Name: move_mbgp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.move_mbgp (
    i_move_id integer NOT NULL,
    i_id_pers_session smallint,
    i_id_pers smallint,
    i_id_session smallint,
    i_id_seq integer,
    dt_start_utc timestamp with time zone,
    dt_end_utc timestamp with time zone,
    dt_start_paris character varying(50),
    dt_end_paris character varying(50),
    i_pid_start integer,
    i_pid_end integer,
    i_duration_secs integer,
    i_distance_m integer,
    r_speed_ms real,
    geom_2154 text,
    i_weartime integer,
    i_time_sed_secs integer,
    i_time_light_secs integer,
    i_time_mod_secs integer,
    i_time_vig_secs integer,
    i_n_sedbreaks integer,
    i_id_carnet_a integer,
    i_id_carnet_d integer
);


ALTER TABLE public.move_mbgp OWNER TO postgres;

--
-- Name: move_mbgp_i_move_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.move_mbgp_i_move_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.move_mbgp_i_move_id_seq OWNER TO postgres;

--
-- Name: move_mbgp_i_move_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.move_mbgp_i_move_id_seq OWNED BY public.move_mbgp.i_move_id;


--
-- Name: pm_concentration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pm_concentration (
    i_pm_id integer NOT NULL,
    i_id_session smallint,
    i_id_pers smallint,
    i_id_pers_session smallint,
    s_id_micropem character varying(10),
    s_id_filtre character varying(10),
    r_pm_measure real,
    dt_ts_utc timestamp with time zone,
    dt_date_utc date,
    dt_time_utc time without time zone,
    i_ts_eup integer,
    i_mois_eup integer,
    i_jour_collecte integer,
    i_id_carnet_a integer,
    i_id_carnet_d integer,
    i_move_id integer,
    i_stop_id integer
);


ALTER TABLE public.pm_concentration OWNER TO postgres;

--
-- Name: pm_concentration_i_pm_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pm_concentration_i_pm_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pm_concentration_i_pm_id_seq OWNER TO postgres;

--
-- Name: pm_concentration_i_pm_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pm_concentration_i_pm_id_seq OWNED BY public.pm_concentration.i_pm_id;


--
-- Name: stop_mbgp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stop_mbgp (
    i_stop_id integer NOT NULL,
    i_id_pers_session smallint,
    i_id_pers smallint,
    i_id_session smallint,
    i_id_seq integer,
    dt_start_utc timestamp with time zone,
    dt_end_utc timestamp with time zone,
    dt_start_paris character varying(50),
    dt_end_paris character varying(50),
    i_pid_start integer,
    i_pid_end integer,
    i_duration_secs integer,
    geom_2154 text,
    i_weartime integer,
    i_time_sed_secs integer,
    i_time_light_secs integer,
    i_time_mod_secs integer,
    i_time_vig_secs integer,
    i_n_sedbreaks integer,
    i_id_carnet_a integer,
    i_id_carnet_d integer
);


ALTER TABLE public.stop_mbgp OWNER TO postgres;

--
-- Name: stop_mbgp_i_stop_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stop_mbgp_i_stop_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stop_mbgp_i_stop_id_seq OWNER TO postgres;

--
-- Name: stop_mbgp_i_stop_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stop_mbgp_i_stop_id_seq OWNED BY public.stop_mbgp.i_stop_id;


--
-- Name: move_mbgp i_move_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.move_mbgp ALTER COLUMN i_move_id SET DEFAULT nextval('public.move_mbgp_i_move_id_seq'::regclass);


--
-- Name: pm_concentration i_pm_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pm_concentration ALTER COLUMN i_pm_id SET DEFAULT nextval('public.pm_concentration_i_pm_id_seq'::regclass);


--
-- Name: stop_mbgp i_stop_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stop_mbgp ALTER COLUMN i_stop_id SET DEFAULT nextval('public.stop_mbgp_i_stop_id_seq'::regclass);


--
-- Data for Name: carnet_activite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carnet_activite (i_id_carnet_a, i_id_pers_session, i_id_act_jour, dt_start_act_utc, dt_end_act_utc, i_duree_mins, i_code_act, s_code_poi, s_non_poi) FROM stdin;
\.
COPY public.carnet_activite (i_id_carnet_a, i_id_pers_session, i_id_act_jour, dt_start_act_utc, dt_end_act_utc, i_duree_mins, i_code_act, s_code_poi, s_non_poi) FROM '$$PATH$$/2184.dat';

--
-- Data for Name: carnet_deplacement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carnet_deplacement (i_id_carnet_d, i_id_pers_session, i_id_dep_jour, dt_start_dep_utc, dt_end_dep_utc, i_duree_mins, s_mode_dep, b_dep_loisir, i_enf_menage, i_enf_autre, i_adul_menage, i_adul_autre) FROM stdin;
\.
COPY public.carnet_deplacement (i_id_carnet_d, i_id_pers_session, i_id_dep_jour, dt_start_dep_utc, dt_end_dep_utc, i_duree_mins, s_mode_dep, b_dep_loisir, i_enf_menage, i_enf_autre, i_adul_menage, i_adul_autre) FROM '$$PATH$$/2185.dat';

--
-- Data for Name: carnet_poi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carnet_poi (i_id_poi, i_id_pers_session, s_code_poi, s_nom_poi, i_num_rue, s_nom_rue, i_code_postal, s_nom_com, s_information, s_obs_enq, s_obs_saisie) FROM stdin;
\.
COPY public.carnet_poi (i_id_poi, i_id_pers_session, s_code_poi, s_nom_poi, i_num_rue, s_nom_rue, i_code_postal, s_nom_com, s_information, s_obs_enq, s_obs_saisie) FROM '$$PATH$$/2186.dat';

--
-- Data for Name: mesure_gps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mesure_gps (i_pid, i_id_pers_session, i_id_pers, i_id_session, i_ts, dt_ts_utc, r_lat, r_long, r_speed, r_course, s_mode, s_fix, i_alt, s_mode1, i_mode2, i_sat_used, r_pdop, r_hdop, r_vdop, i_sat_in_view, geom_2154) FROM stdin;
\.
COPY public.mesure_gps (i_pid, i_id_pers_session, i_id_pers, i_id_session, i_ts, dt_ts_utc, r_lat, r_long, r_speed, r_course, s_mode, s_fix, i_alt, s_mode1, i_mode2, i_sat_used, r_pdop, r_hdop, r_vdop, i_sat_in_view, geom_2154) FROM '$$PATH$$/2187.dat';

--
-- Data for Name: move_mbgp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.move_mbgp (i_move_id, i_id_pers_session, i_id_pers, i_id_session, i_id_seq, dt_start_utc, dt_end_utc, dt_start_paris, dt_end_paris, i_pid_start, i_pid_end, i_duration_secs, i_distance_m, r_speed_ms, geom_2154, i_weartime, i_time_sed_secs, i_time_light_secs, i_time_mod_secs, i_time_vig_secs, i_n_sedbreaks, i_id_carnet_a, i_id_carnet_d) FROM stdin;
\.
COPY public.move_mbgp (i_move_id, i_id_pers_session, i_id_pers, i_id_session, i_id_seq, dt_start_utc, dt_end_utc, dt_start_paris, dt_end_paris, i_pid_start, i_pid_end, i_duration_secs, i_distance_m, r_speed_ms, geom_2154, i_weartime, i_time_sed_secs, i_time_light_secs, i_time_mod_secs, i_time_vig_secs, i_n_sedbreaks, i_id_carnet_a, i_id_carnet_d) FROM '$$PATH$$/2179.dat';

--
-- Name: move_mbgp_i_move_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.move_mbgp_i_move_id_seq', 1, false);


--
-- Data for Name: pm_concentration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pm_concentration (i_pm_id, i_id_session, i_id_pers, i_id_pers_session, s_id_micropem, s_id_filtre, r_pm_measure, dt_ts_utc, dt_date_utc, dt_time_utc, i_ts_eup, i_mois_eup, i_jour_collecte, i_id_carnet_a, i_id_carnet_d, i_move_id, i_stop_id) FROM stdin;
\.
COPY public.pm_concentration (i_pm_id, i_id_session, i_id_pers, i_id_pers_session, s_id_micropem, s_id_filtre, r_pm_measure, dt_ts_utc, dt_date_utc, dt_time_utc, i_ts_eup, i_mois_eup, i_jour_collecte, i_id_carnet_a, i_id_carnet_d, i_move_id, i_stop_id) FROM '$$PATH$$/2183.dat';

--
-- Name: pm_concentration_i_pm_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pm_concentration_i_pm_id_seq', 1, false);


--
-- Data for Name: stop_mbgp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stop_mbgp (i_stop_id, i_id_pers_session, i_id_pers, i_id_session, i_id_seq, dt_start_utc, dt_end_utc, dt_start_paris, dt_end_paris, i_pid_start, i_pid_end, i_duration_secs, geom_2154, i_weartime, i_time_sed_secs, i_time_light_secs, i_time_mod_secs, i_time_vig_secs, i_n_sedbreaks, i_id_carnet_a, i_id_carnet_d) FROM stdin;
\.
COPY public.stop_mbgp (i_stop_id, i_id_pers_session, i_id_pers, i_id_session, i_id_seq, dt_start_utc, dt_end_utc, dt_start_paris, dt_end_paris, i_pid_start, i_pid_end, i_duration_secs, geom_2154, i_weartime, i_time_sed_secs, i_time_light_secs, i_time_mod_secs, i_time_vig_secs, i_n_sedbreaks, i_id_carnet_a, i_id_carnet_d) FROM '$$PATH$$/2181.dat';

--
-- Name: stop_mbgp_i_stop_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stop_mbgp_i_stop_id_seq', 1, false);


--
-- Name: carnet_activite carnet_activite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carnet_activite
    ADD CONSTRAINT carnet_activite_pkey PRIMARY KEY (i_id_carnet_a);


--
-- Name: carnet_deplacement carnet_deplacement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carnet_deplacement
    ADD CONSTRAINT carnet_deplacement_pkey PRIMARY KEY (i_id_carnet_d);


--
-- Name: carnet_poi carnet_poi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carnet_poi
    ADD CONSTRAINT carnet_poi_pkey PRIMARY KEY (i_id_pers_session, s_code_poi);


--
-- Name: mesure_gps mesure_gps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesure_gps
    ADD CONSTRAINT mesure_gps_pkey PRIMARY KEY (i_pid);


--
-- Name: move_mbgp move_mbgp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.move_mbgp
    ADD CONSTRAINT move_mbgp_pkey PRIMARY KEY (i_move_id);


--
-- Name: pm_concentration pm_concentration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pm_concentration
    ADD CONSTRAINT pm_concentration_pkey PRIMARY KEY (i_pm_id);


--
-- Name: stop_mbgp stop_mbgp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stop_mbgp
    ADD CONSTRAINT stop_mbgp_pkey PRIMARY KEY (i_stop_id);


--
-- Name: carnet_activite fk_carnet_act_poi; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carnet_activite
    ADD CONSTRAINT fk_carnet_act_poi FOREIGN KEY (i_id_pers_session, s_code_poi) REFERENCES public.carnet_poi(i_id_pers_session, s_code_poi);


--
-- Name: move_mbgp fk_move_activite; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.move_mbgp
    ADD CONSTRAINT fk_move_activite FOREIGN KEY (i_id_carnet_a) REFERENCES public.carnet_activite(i_id_carnet_a);


--
-- Name: move_mbgp fk_move_deplacement; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.move_mbgp
    ADD CONSTRAINT fk_move_deplacement FOREIGN KEY (i_id_carnet_d) REFERENCES public.carnet_deplacement(i_id_carnet_d);


--
-- Name: pm_concentration fk_pm_activite; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pm_concentration
    ADD CONSTRAINT fk_pm_activite FOREIGN KEY (i_id_carnet_a) REFERENCES public.carnet_activite(i_id_carnet_a);


--
-- Name: pm_concentration fk_pm_deplacement; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pm_concentration
    ADD CONSTRAINT fk_pm_deplacement FOREIGN KEY (i_id_carnet_d) REFERENCES public.carnet_deplacement(i_id_carnet_d);


--
-- Name: pm_concentration fk_pm_moves; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pm_concentration
    ADD CONSTRAINT fk_pm_moves FOREIGN KEY (i_move_id) REFERENCES public.move_mbgp(i_move_id);


--
-- Name: pm_concentration fk_pm_stops; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pm_concentration
    ADD CONSTRAINT fk_pm_stops FOREIGN KEY (i_stop_id) REFERENCES public.stop_mbgp(i_stop_id);


--
-- Name: stop_mbgp fk_stop_activite; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stop_mbgp
    ADD CONSTRAINT fk_stop_activite FOREIGN KEY (i_id_carnet_a) REFERENCES public.carnet_activite(i_id_carnet_a);


--
-- Name: stop_mbgp fk_stop_deplacement; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stop_mbgp
    ADD CONSTRAINT fk_stop_deplacement FOREIGN KEY (i_id_carnet_d) REFERENCES public.carnet_deplacement(i_id_carnet_d);


--
-- PostgreSQL database dump complete
--

