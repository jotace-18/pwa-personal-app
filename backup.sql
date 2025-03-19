--
-- PostgreSQL database dump
--

-- Dumped from database version 15.12 (Debian 15.12-1.pgdg120+1)
-- Dumped by pg_dump version 15.12 (Debian 15.12-1.pgdg120+1)

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

--
-- Name: update_ultima_actualizacion(); Type: FUNCTION; Schema: public; Owner: jotace-18
--

CREATE FUNCTION public.update_ultima_actualizacion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.ultima_actualizacion = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_ultima_actualizacion() OWNER TO "jotace-18";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alimento; Type: TABLE; Schema: public; Owner: jotace-18
--

CREATE TABLE public.alimento (
    id_alimento integer NOT NULL,
    nombre_alimento character varying(50) NOT NULL,
    tipo character varying(50) NOT NULL,
    supermercado character varying(100) NOT NULL,
    precio numeric(10,2) NOT NULL,
    calorias integer NOT NULL,
    ultima_actualizacion timestamp without time zone DEFAULT now(),
    marca character varying(255),
    CONSTRAINT alimento_calorias_check CHECK ((calorias >= 0)),
    CONSTRAINT alimento_precio_check CHECK ((precio >= (0)::numeric))
);


ALTER TABLE public.alimento OWNER TO "jotace-18";

--
-- Name: alimento_id_alimento_seq; Type: SEQUENCE; Schema: public; Owner: jotace-18
--

CREATE SEQUENCE public.alimento_id_alimento_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.alimento_id_alimento_seq OWNER TO "jotace-18";

--
-- Name: alimento_id_alimento_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jotace-18
--

ALTER SEQUENCE public.alimento_id_alimento_seq OWNED BY public.alimento.id_alimento;


--
-- Name: alimento_nutriente; Type: TABLE; Schema: public; Owner: jotace-18
--

CREATE TABLE public.alimento_nutriente (
    id_alimento integer NOT NULL,
    id_nutriente integer NOT NULL,
    cantidad numeric(6,2),
    CONSTRAINT alimento_nutriente_cantidad_check CHECK ((cantidad >= (0)::numeric))
);


ALTER TABLE public.alimento_nutriente OWNER TO "jotace-18";

--
-- Name: dieta; Type: TABLE; Schema: public; Owner: jotace-18
--

CREATE TABLE public.dieta (
    id_dieta integer NOT NULL,
    user_id integer NOT NULL,
    nombre_dieta character varying(50) NOT NULL,
    descripcion text,
    tipo_dieta character varying(20) NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now(),
    fecha_inicio date NOT NULL
);


ALTER TABLE public.dieta OWNER TO "jotace-18";

--
-- Name: dieta_alimento; Type: TABLE; Schema: public; Owner: jotace-18
--

CREATE TABLE public.dieta_alimento (
    id_dieta integer NOT NULL,
    id_alimento integer NOT NULL,
    dia character varying(10) NOT NULL,
    comida character varying(10) NOT NULL,
    cantidad numeric(6,2),
    CONSTRAINT dieta_alimento_cantidad_check CHECK ((cantidad >= (0)::numeric)),
    CONSTRAINT dieta_alimento_comida_check CHECK (((comida)::text = ANY ((ARRAY['Desayuno'::character varying, 'Almuerzo'::character varying, 'Cena'::character varying, 'Merienda'::character varying])::text[]))),
    CONSTRAINT dieta_alimento_dia_check CHECK (((dia)::text = ANY ((ARRAY['Lunes'::character varying, 'Martes'::character varying, 'Miércoles'::character varying, 'Jueves'::character varying, 'Viernes'::character varying, 'Sábado'::character varying, 'Domingo'::character varying])::text[])))
);


ALTER TABLE public.dieta_alimento OWNER TO "jotace-18";

--
-- Name: dieta_id_dieta_seq; Type: SEQUENCE; Schema: public; Owner: jotace-18
--

CREATE SEQUENCE public.dieta_id_dieta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dieta_id_dieta_seq OWNER TO "jotace-18";

--
-- Name: dieta_id_dieta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jotace-18
--

ALTER SEQUENCE public.dieta_id_dieta_seq OWNED BY public.dieta.id_dieta;


--
-- Name: historial_consumo; Type: TABLE; Schema: public; Owner: jotace-18
--

CREATE TABLE public.historial_consumo (
    id_consumo integer NOT NULL,
    id_user integer NOT NULL,
    id_alimento integer NOT NULL,
    fecha timestamp without time zone DEFAULT now(),
    comida character varying(10) NOT NULL,
    cantidad numeric(6,2),
    CONSTRAINT historial_consumo_cantidad_check CHECK ((cantidad >= (0)::numeric)),
    CONSTRAINT historial_consumo_comida_check CHECK (((comida)::text = ANY ((ARRAY['Desayuno'::character varying, 'Almuerzo'::character varying, 'Cena'::character varying, 'Merienda'::character varying])::text[])))
);


ALTER TABLE public.historial_consumo OWNER TO "jotace-18";

--
-- Name: historial_consumo_id_consumo_seq; Type: SEQUENCE; Schema: public; Owner: jotace-18
--

CREATE SEQUENCE public.historial_consumo_id_consumo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.historial_consumo_id_consumo_seq OWNER TO "jotace-18";

--
-- Name: historial_consumo_id_consumo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jotace-18
--

ALTER SEQUENCE public.historial_consumo_id_consumo_seq OWNED BY public.historial_consumo.id_consumo;


--
-- Name: lista_compra; Type: TABLE; Schema: public; Owner: jotace-18
--

CREATE TABLE public.lista_compra (
    id_lista integer NOT NULL,
    id_user integer NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now(),
    estado character varying(10) DEFAULT 'Pendiente'::character varying,
    CONSTRAINT lista_compra_estado_check CHECK (((estado)::text = ANY ((ARRAY['Pendiente'::character varying, 'Comprado'::character varying, 'Cancelado'::character varying])::text[])))
);


ALTER TABLE public.lista_compra OWNER TO "jotace-18";

--
-- Name: lista_compra_alimento; Type: TABLE; Schema: public; Owner: jotace-18
--

CREATE TABLE public.lista_compra_alimento (
    id_lista integer NOT NULL,
    id_alimento integer NOT NULL,
    cantidad numeric(6,2),
    CONSTRAINT lista_compra_alimento_cantidad_check CHECK ((cantidad >= (0)::numeric))
);


ALTER TABLE public.lista_compra_alimento OWNER TO "jotace-18";

--
-- Name: lista_compra_id_lista_seq; Type: SEQUENCE; Schema: public; Owner: jotace-18
--

CREATE SEQUENCE public.lista_compra_id_lista_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lista_compra_id_lista_seq OWNER TO "jotace-18";

--
-- Name: lista_compra_id_lista_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jotace-18
--

ALTER SEQUENCE public.lista_compra_id_lista_seq OWNED BY public.lista_compra.id_lista;


--
-- Name: nutriente; Type: TABLE; Schema: public; Owner: jotace-18
--

CREATE TABLE public.nutriente (
    id_nutriente integer NOT NULL,
    nombre_nutriente character varying(50) NOT NULL,
    unidad character varying(20) NOT NULL
);


ALTER TABLE public.nutriente OWNER TO "jotace-18";

--
-- Name: nutriente_id_nutriente_seq; Type: SEQUENCE; Schema: public; Owner: jotace-18
--

CREATE SEQUENCE public.nutriente_id_nutriente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.nutriente_id_nutriente_seq OWNER TO "jotace-18";

--
-- Name: nutriente_id_nutriente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jotace-18
--

ALTER SEQUENCE public.nutriente_id_nutriente_seq OWNED BY public.nutriente.id_nutriente;


--
-- Name: receta; Type: TABLE; Schema: public; Owner: jotace-18
--

CREATE TABLE public.receta (
    id_receta integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    instrucciones text,
    tiempo_preparacion integer,
    user_id integer NOT NULL,
    CONSTRAINT receta_tiempo_preparacion_check CHECK ((tiempo_preparacion >= 0))
);


ALTER TABLE public.receta OWNER TO "jotace-18";

--
-- Name: receta_alimento; Type: TABLE; Schema: public; Owner: jotace-18
--

CREATE TABLE public.receta_alimento (
    id_receta integer NOT NULL,
    id_alimento integer NOT NULL,
    cantidad numeric(6,2),
    unidad character varying(20),
    CONSTRAINT receta_alimento_cantidad_check CHECK ((cantidad >= (0)::numeric))
);


ALTER TABLE public.receta_alimento OWNER TO "jotace-18";

--
-- Name: receta_id_receta_seq; Type: SEQUENCE; Schema: public; Owner: jotace-18
--

CREATE SEQUENCE public.receta_id_receta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.receta_id_receta_seq OWNER TO "jotace-18";

--
-- Name: receta_id_receta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jotace-18
--

ALTER SEQUENCE public.receta_id_receta_seq OWNED BY public.receta.id_receta;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: jotace-18
--

CREATE TABLE public.usuario (
    id_user integer NOT NULL,
    nombre character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    fecha_registro timestamp without time zone DEFAULT now(),
    avatar character varying(100) DEFAULT 'default.png'::character varying,
    rol character varying(20) DEFAULT 'user'::character varying,
    peso numeric(6,2),
    altura numeric(6,2),
    edad integer,
    sexo character varying(1),
    CONSTRAINT check_rol CHECK (((rol)::text = ANY ((ARRAY['user'::character varying, 'admin'::character varying])::text[]))),
    CONSTRAINT usuario_altura_check CHECK ((altura >= (0)::numeric)),
    CONSTRAINT usuario_edad_check CHECK ((edad >= 0)),
    CONSTRAINT usuario_peso_check CHECK ((peso >= (0)::numeric)),
    CONSTRAINT usuario_sexo_check CHECK (((sexo)::text = ANY ((ARRAY['M'::character varying, 'F'::character varying])::text[])))
);


ALTER TABLE public.usuario OWNER TO "jotace-18";

--
-- Name: usuario_id_user_seq; Type: SEQUENCE; Schema: public; Owner: jotace-18
--

CREATE SEQUENCE public.usuario_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usuario_id_user_seq OWNER TO "jotace-18";

--
-- Name: usuario_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jotace-18
--

ALTER SEQUENCE public.usuario_id_user_seq OWNED BY public.usuario.id_user;


--
-- Name: alimento id_alimento; Type: DEFAULT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.alimento ALTER COLUMN id_alimento SET DEFAULT nextval('public.alimento_id_alimento_seq'::regclass);


--
-- Name: dieta id_dieta; Type: DEFAULT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.dieta ALTER COLUMN id_dieta SET DEFAULT nextval('public.dieta_id_dieta_seq'::regclass);


--
-- Name: historial_consumo id_consumo; Type: DEFAULT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.historial_consumo ALTER COLUMN id_consumo SET DEFAULT nextval('public.historial_consumo_id_consumo_seq'::regclass);


--
-- Name: lista_compra id_lista; Type: DEFAULT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.lista_compra ALTER COLUMN id_lista SET DEFAULT nextval('public.lista_compra_id_lista_seq'::regclass);


--
-- Name: nutriente id_nutriente; Type: DEFAULT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.nutriente ALTER COLUMN id_nutriente SET DEFAULT nextval('public.nutriente_id_nutriente_seq'::regclass);


--
-- Name: receta id_receta; Type: DEFAULT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.receta ALTER COLUMN id_receta SET DEFAULT nextval('public.receta_id_receta_seq'::regclass);


--
-- Name: usuario id_user; Type: DEFAULT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_user SET DEFAULT nextval('public.usuario_id_user_seq'::regclass);


--
-- Data for Name: alimento; Type: TABLE DATA; Schema: public; Owner: jotace-18
--

COPY public.alimento (id_alimento, nombre_alimento, tipo, supermercado, precio, calorias, ultima_actualizacion, marca) FROM stdin;
1	Pechuga de pollo	Carne	Mercadona	0.55	107	2025-03-03 08:45:11.606394	\N
\.


--
-- Data for Name: alimento_nutriente; Type: TABLE DATA; Schema: public; Owner: jotace-18
--

COPY public.alimento_nutriente (id_alimento, id_nutriente, cantidad) FROM stdin;
1	1	1.80
1	2	0.60
1	4	0.50
1	3	0.00
1	5	0.00
1	6	22.00
1	7	0.19
\.


--
-- Data for Name: dieta; Type: TABLE DATA; Schema: public; Owner: jotace-18
--

COPY public.dieta (id_dieta, user_id, nombre_dieta, descripcion, tipo_dieta, fecha_creacion, fecha_inicio) FROM stdin;
\.


--
-- Data for Name: dieta_alimento; Type: TABLE DATA; Schema: public; Owner: jotace-18
--

COPY public.dieta_alimento (id_dieta, id_alimento, dia, comida, cantidad) FROM stdin;
\.


--
-- Data for Name: historial_consumo; Type: TABLE DATA; Schema: public; Owner: jotace-18
--

COPY public.historial_consumo (id_consumo, id_user, id_alimento, fecha, comida, cantidad) FROM stdin;
\.


--
-- Data for Name: lista_compra; Type: TABLE DATA; Schema: public; Owner: jotace-18
--

COPY public.lista_compra (id_lista, id_user, fecha_creacion, estado) FROM stdin;
\.


--
-- Data for Name: lista_compra_alimento; Type: TABLE DATA; Schema: public; Owner: jotace-18
--

COPY public.lista_compra_alimento (id_lista, id_alimento, cantidad) FROM stdin;
\.


--
-- Data for Name: nutriente; Type: TABLE DATA; Schema: public; Owner: jotace-18
--

COPY public.nutriente (id_nutriente, nombre_nutriente, unidad) FROM stdin;
1	Grasas	g
2	Grasas Saturadas	g
3	Azúcares	g
4	Hidratos de carbono	g
5	Fibra	g
6	Proteínas	g
7	Sal	g
\.


--
-- Data for Name: receta; Type: TABLE DATA; Schema: public; Owner: jotace-18
--

COPY public.receta (id_receta, nombre, descripcion, instrucciones, tiempo_preparacion, user_id) FROM stdin;
\.


--
-- Data for Name: receta_alimento; Type: TABLE DATA; Schema: public; Owner: jotace-18
--

COPY public.receta_alimento (id_receta, id_alimento, cantidad, unidad) FROM stdin;
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: jotace-18
--

COPY public.usuario (id_user, nombre, email, password, fecha_registro, avatar, rol, peso, altura, edad, sexo) FROM stdin;
\.


--
-- Name: alimento_id_alimento_seq; Type: SEQUENCE SET; Schema: public; Owner: jotace-18
--

SELECT pg_catalog.setval('public.alimento_id_alimento_seq', 1, true);


--
-- Name: dieta_id_dieta_seq; Type: SEQUENCE SET; Schema: public; Owner: jotace-18
--

SELECT pg_catalog.setval('public.dieta_id_dieta_seq', 1, false);


--
-- Name: historial_consumo_id_consumo_seq; Type: SEQUENCE SET; Schema: public; Owner: jotace-18
--

SELECT pg_catalog.setval('public.historial_consumo_id_consumo_seq', 1, false);


--
-- Name: lista_compra_id_lista_seq; Type: SEQUENCE SET; Schema: public; Owner: jotace-18
--

SELECT pg_catalog.setval('public.lista_compra_id_lista_seq', 1, false);


--
-- Name: nutriente_id_nutriente_seq; Type: SEQUENCE SET; Schema: public; Owner: jotace-18
--

SELECT pg_catalog.setval('public.nutriente_id_nutriente_seq', 7, true);


--
-- Name: receta_id_receta_seq; Type: SEQUENCE SET; Schema: public; Owner: jotace-18
--

SELECT pg_catalog.setval('public.receta_id_receta_seq', 1, false);


--
-- Name: usuario_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: jotace-18
--

SELECT pg_catalog.setval('public.usuario_id_user_seq', 1, false);


--
-- Name: alimento_nutriente alimento_nutriente_pkey; Type: CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.alimento_nutriente
    ADD CONSTRAINT alimento_nutriente_pkey PRIMARY KEY (id_alimento, id_nutriente);


--
-- Name: alimento alimento_pkey; Type: CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.alimento
    ADD CONSTRAINT alimento_pkey PRIMARY KEY (id_alimento);


--
-- Name: dieta_alimento dieta_alimento_pkey; Type: CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.dieta_alimento
    ADD CONSTRAINT dieta_alimento_pkey PRIMARY KEY (id_dieta, id_alimento, dia, comida);


--
-- Name: dieta dieta_pkey; Type: CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.dieta
    ADD CONSTRAINT dieta_pkey PRIMARY KEY (id_dieta);


--
-- Name: historial_consumo historial_consumo_pkey; Type: CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.historial_consumo
    ADD CONSTRAINT historial_consumo_pkey PRIMARY KEY (id_consumo);


--
-- Name: lista_compra lista_compra_pkey; Type: CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.lista_compra
    ADD CONSTRAINT lista_compra_pkey PRIMARY KEY (id_lista);


--
-- Name: nutriente nutriente_nombre_nutriente_key; Type: CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.nutriente
    ADD CONSTRAINT nutriente_nombre_nutriente_key UNIQUE (nombre_nutriente);


--
-- Name: nutriente nutriente_pkey; Type: CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.nutriente
    ADD CONSTRAINT nutriente_pkey PRIMARY KEY (id_nutriente);


--
-- Name: receta_alimento receta_alimento_pkey; Type: CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.receta_alimento
    ADD CONSTRAINT receta_alimento_pkey PRIMARY KEY (id_receta, id_alimento);


--
-- Name: receta receta_pkey; Type: CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.receta
    ADD CONSTRAINT receta_pkey PRIMARY KEY (id_receta);


--
-- Name: alimento unique_alimento_supermercado; Type: CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.alimento
    ADD CONSTRAINT unique_alimento_supermercado UNIQUE (nombre_alimento, supermercado);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_user);


--
-- Name: alimento trigger_update_ultima_actualizacion; Type: TRIGGER; Schema: public; Owner: jotace-18
--

CREATE TRIGGER trigger_update_ultima_actualizacion BEFORE UPDATE ON public.alimento FOR EACH ROW EXECUTE FUNCTION public.update_ultima_actualizacion();


--
-- Name: alimento_nutriente alimento_nutriente_id_alimento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.alimento_nutriente
    ADD CONSTRAINT alimento_nutriente_id_alimento_fkey FOREIGN KEY (id_alimento) REFERENCES public.alimento(id_alimento) ON DELETE CASCADE;


--
-- Name: alimento_nutriente alimento_nutriente_id_nutriente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.alimento_nutriente
    ADD CONSTRAINT alimento_nutriente_id_nutriente_fkey FOREIGN KEY (id_nutriente) REFERENCES public.nutriente(id_nutriente) ON DELETE CASCADE;


--
-- Name: dieta_alimento dieta_alimento_id_alimento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.dieta_alimento
    ADD CONSTRAINT dieta_alimento_id_alimento_fkey FOREIGN KEY (id_alimento) REFERENCES public.alimento(id_alimento) ON DELETE CASCADE;


--
-- Name: dieta_alimento dieta_alimento_id_dieta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.dieta_alimento
    ADD CONSTRAINT dieta_alimento_id_dieta_fkey FOREIGN KEY (id_dieta) REFERENCES public.dieta(id_dieta) ON DELETE CASCADE;


--
-- Name: dieta fk_user; Type: FK CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.dieta
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.usuario(id_user) ON DELETE CASCADE;


--
-- Name: historial_consumo historial_consumo_id_alimento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.historial_consumo
    ADD CONSTRAINT historial_consumo_id_alimento_fkey FOREIGN KEY (id_alimento) REFERENCES public.alimento(id_alimento) ON DELETE CASCADE;


--
-- Name: historial_consumo historial_consumo_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.historial_consumo
    ADD CONSTRAINT historial_consumo_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.usuario(id_user) ON DELETE CASCADE;


--
-- Name: lista_compra_alimento lista_compra_alimento_id_alimento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.lista_compra_alimento
    ADD CONSTRAINT lista_compra_alimento_id_alimento_fkey FOREIGN KEY (id_alimento) REFERENCES public.alimento(id_alimento) ON DELETE CASCADE;


--
-- Name: lista_compra_alimento lista_compra_alimento_id_lista_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.lista_compra_alimento
    ADD CONSTRAINT lista_compra_alimento_id_lista_fkey FOREIGN KEY (id_lista) REFERENCES public.lista_compra(id_lista) ON DELETE CASCADE;


--
-- Name: lista_compra lista_compra_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.lista_compra
    ADD CONSTRAINT lista_compra_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.usuario(id_user) ON DELETE CASCADE;


--
-- Name: receta_alimento receta_alimento_id_alimento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.receta_alimento
    ADD CONSTRAINT receta_alimento_id_alimento_fkey FOREIGN KEY (id_alimento) REFERENCES public.alimento(id_alimento) ON DELETE CASCADE;


--
-- Name: receta_alimento receta_alimento_id_receta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.receta_alimento
    ADD CONSTRAINT receta_alimento_id_receta_fkey FOREIGN KEY (id_receta) REFERENCES public.receta(id_receta) ON DELETE CASCADE;


--
-- Name: receta receta_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jotace-18
--

ALTER TABLE ONLY public.receta
    ADD CONSTRAINT receta_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuario(id_user) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

