--
-- PostgreSQL database dump
--

\restrict QVgVMVUgUrhqOWdTBhz9F8sFsxkPMxFNW3STTtd0W0Xtksa3pfFP3oJpk9LtJUK

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: StatusVenda; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatusVenda" AS ENUM (
    'PAGO',
    'PENDENTE'
);


ALTER TYPE public."StatusVenda" OWNER TO postgres;

--
-- Name: TipoMovEstoque; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TipoMovEstoque" AS ENUM (
    'ENTRADA',
    'SAIDA',
    'AJUSTE'
);


ALTER TYPE public."TipoMovEstoque" OWNER TO postgres;

--
-- Name: TipoPagamento; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TipoPagamento" AS ENUM (
    'AVISTA',
    'CREDITO',
    'FIADO'
);


ALTER TYPE public."TipoPagamento" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Cliente" (
    id integer NOT NULL,
    nome text NOT NULL,
    telefone text,
    endereco text,
    "saldoDevedor" numeric(10,2) DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Cliente" OWNER TO postgres;

--
-- Name: Cliente_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Cliente_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Cliente_id_seq" OWNER TO postgres;

--
-- Name: Cliente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Cliente_id_seq" OWNED BY public."Cliente".id;


--
-- Name: Fornecedor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Fornecedor" (
    id integer NOT NULL,
    nome text NOT NULL,
    telefone text,
    email text,
    endereco text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Fornecedor" OWNER TO postgres;

--
-- Name: Fornecedor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Fornecedor_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Fornecedor_id_seq" OWNER TO postgres;

--
-- Name: Fornecedor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Fornecedor_id_seq" OWNED BY public."Fornecedor".id;


--
-- Name: ItemVenda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ItemVenda" (
    id integer NOT NULL,
    quantidade integer NOT NULL,
    "precoUnitario" numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    "vendaId" integer NOT NULL,
    "produtoId" integer NOT NULL
);


ALTER TABLE public."ItemVenda" OWNER TO postgres;

--
-- Name: ItemVenda_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ItemVenda_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ItemVenda_id_seq" OWNER TO postgres;

--
-- Name: ItemVenda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ItemVenda_id_seq" OWNED BY public."ItemVenda".id;


--
-- Name: MovimentacaoEstoque; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MovimentacaoEstoque" (
    id integer NOT NULL,
    quantidade integer NOT NULL,
    motivo text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "produtoId" integer NOT NULL,
    tipo public."TipoMovEstoque" NOT NULL
);


ALTER TABLE public."MovimentacaoEstoque" OWNER TO postgres;

--
-- Name: MovimentacaoEstoque_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MovimentacaoEstoque_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MovimentacaoEstoque_id_seq" OWNER TO postgres;

--
-- Name: MovimentacaoEstoque_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MovimentacaoEstoque_id_seq" OWNED BY public."MovimentacaoEstoque".id;


--
-- Name: Pagamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Pagamento" (
    id integer NOT NULL,
    valor numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "clienteId" integer NOT NULL,
    "formaPagamento" public."TipoPagamento" NOT NULL
);


ALTER TABLE public."Pagamento" OWNER TO postgres;

--
-- Name: Pagamento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Pagamento_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Pagamento_id_seq" OWNER TO postgres;

--
-- Name: Pagamento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Pagamento_id_seq" OWNED BY public."Pagamento".id;


--
-- Name: Produto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Produto" (
    id integer NOT NULL,
    nome text NOT NULL,
    descricao text,
    preco numeric(10,2) NOT NULL,
    estoque integer DEFAULT 0 NOT NULL,
    "estoqueMinimo" integer DEFAULT 0 NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "fornecedorId" integer NOT NULL
);


ALTER TABLE public."Produto" OWNER TO postgres;

--
-- Name: Produto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Produto_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Produto_id_seq" OWNER TO postgres;

--
-- Name: Produto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Produto_id_seq" OWNED BY public."Produto".id;


--
-- Name: Venda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Venda" (
    id integer NOT NULL,
    total numeric(10,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "clienteId" integer,
    "tipoPagamento" public."TipoPagamento" NOT NULL,
    status public."StatusVenda" NOT NULL,
    "saldoPendente" numeric(10,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public."Venda" OWNER TO postgres;

--
-- Name: Venda_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Venda_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Venda_id_seq" OWNER TO postgres;

--
-- Name: Venda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Venda_id_seq" OWNED BY public."Venda".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Cliente id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cliente" ALTER COLUMN id SET DEFAULT nextval('public."Cliente_id_seq"'::regclass);


--
-- Name: Fornecedor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Fornecedor" ALTER COLUMN id SET DEFAULT nextval('public."Fornecedor_id_seq"'::regclass);


--
-- Name: ItemVenda id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ItemVenda" ALTER COLUMN id SET DEFAULT nextval('public."ItemVenda_id_seq"'::regclass);


--
-- Name: MovimentacaoEstoque id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovimentacaoEstoque" ALTER COLUMN id SET DEFAULT nextval('public."MovimentacaoEstoque_id_seq"'::regclass);


--
-- Name: Pagamento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pagamento" ALTER COLUMN id SET DEFAULT nextval('public."Pagamento_id_seq"'::regclass);


--
-- Name: Produto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Produto" ALTER COLUMN id SET DEFAULT nextval('public."Produto_id_seq"'::regclass);


--
-- Name: Venda id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Venda" ALTER COLUMN id SET DEFAULT nextval('public."Venda_id_seq"'::regclass);


--
-- Data for Name: Cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Cliente" (id, nome, telefone, endereco, "saldoDevedor", "createdAt", "updatedAt") FROM stdin;
4	João Silva	19999990001	Rua A, 10	0.00	2026-02-23 20:02:45.94	2026-02-23 20:02:45.94
5	Maria Souza	19999990002	Rua B, 20	0.00	2026-02-23 20:02:45.94	2026-02-23 20:02:45.94
6	Empresa XPTO	19333330003	Av. Central, 500	0.00	2026-02-23 20:02:45.94	2026-02-23 20:02:45.94
7	Bruno Souza	19987168649	Av.  Juscelino Kubitcsheck de Oliveira, 801	0.00	2026-03-04 15:06:54.672	2026-03-23 15:58:19.755
\.


--
-- Data for Name: Fornecedor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Fornecedor" (id, nome, telefone, email, endereco, "createdAt", "updatedAt") FROM stdin;
6	Distribuidora Central	11999999999	contato@central.com	Rua das Indústrias, 100	2026-02-23 20:02:45.937	2026-02-23 20:02:45.937
7	Laticínios Vale Leite	11988887777	vendas@valeleite.com	Av. Leiteira, 250	2026-02-23 20:02:45.937	2026-02-23 20:02:45.937
8	Padaria Atacadão (Insumos)	11977776666	comercial@atacadaoinsumos.com	Rod. Principal, km 12	2026-02-23 20:02:45.937	2026-02-23 20:02:45.937
9	Bebidas & Cia	11966665555	pedido@bebidasecia.com	Rua dos Refrigerantes, 45	2026-02-23 20:02:45.937	2026-02-23 20:02:45.937
10	Doces Premium	11955554444	contato@docespremium.com	Rua dos Confeiteiros, 88	2026-02-23 20:02:45.937	2026-02-23 20:02:45.937
\.


--
-- Data for Name: ItemVenda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ItemVenda" (id, quantidade, "precoUnitario", subtotal, "vendaId", "produtoId") FROM stdin;
1	2	0.80	1.60	1	1
2	1	1.20	1.20	1	2
3	1	1.50	1.50	2	3
4	1	6.90	6.90	2	7
5	1	8.90	8.90	2	18
6	6	0.80	4.80	3	1
7	1	1.20	1.20	3	2
8	1	8.90	8.90	3	18
9	1	2.50	2.50	3	21
10	10	9.50	95.00	4	24
11	1	1.20	1.20	5	2
\.


--
-- Data for Name: MovimentacaoEstoque; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MovimentacaoEstoque" (id, quantidade, motivo, "createdAt", "produtoId", tipo) FROM stdin;
1	1	Venda	2026-03-04 15:07:54.069	3	SAIDA
2	1	Venda	2026-03-04 15:07:54.081	7	SAIDA
3	1	Venda	2026-03-04 15:07:54.085	18	SAIDA
4	6	Venda	2026-03-23 15:57:36.847	1	SAIDA
5	1	Venda	2026-03-23 15:57:36.857	2	SAIDA
6	1	Venda	2026-03-23 15:57:36.86	18	SAIDA
7	1	Venda	2026-03-23 15:57:36.863	21	SAIDA
8	10	Venda	2026-03-23 16:30:59.336	24	SAIDA
9	1	Venda	2026-03-23 16:44:33.135	2	SAIDA
\.


--
-- Data for Name: Pagamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Pagamento" (id, valor, "createdAt", "clienteId", "formaPagamento") FROM stdin;
1	17.00	2026-03-23 15:19:25.507	7	AVISTA
2	17.70	2026-03-23 15:58:19.753	7	CREDITO
\.


--
-- Data for Name: Produto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Produto" (id, nome, descricao, preco, estoque, "estoqueMinimo", ativo, "createdAt", "updatedAt", "fornecedorId") FROM stdin;
1	Pão Francês	Pão tradicional	0.80	47	50	t	2026-02-23 20:02:45.942	2026-03-23 15:57:36.845	8
18	Suco 1L	Uva	8.90	23	6	t	2026-02-23 20:02:45.942	2026-03-23 15:57:36.859	9
21	Brigadeiro (un)	Unidade	2.50	79	20	t	2026-02-23 20:02:45.942	2026-03-23 15:57:36.862	10
24	Torta Holandesa (fat)	Fatia	9.50	5	5	t	2026-02-23 20:02:45.942	2026-03-23 16:30:59.333	10
2	Pão de Leite	Macio e levemente doce	1.20	1	20	t	2026-02-23 20:02:45.942	2026-03-23 16:44:33.132	8
4	Bolo de Chocolate (fat)	Fatia	6.50	40	10	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	10
5	Bolo de Cenoura (fat)	Fatia	6.00	35	10	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	10
6	Sonho	Recheado	5.50	25	8	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	10
8	Esfiha	Carne	7.50	50	12	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	8
9	Empada	Palmito	7.90	30	10	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	8
10	Croissant	Manteiga	8.90	20	8	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	8
11	Leite 1L	Integral	5.80	50	10	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	7
12	Manteiga 200g	Com sal	9.90	35	8	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	7
13	Queijo Mussarela (100g)	Fatiado	6.50	80	15	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	7
14	Presunto (100g)	Fatiado	5.90	70	15	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	7
15	Coca-Cola 2L	Refrigerante	10.50	40	8	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	9
16	Guaraná 2L	Refrigerante	9.50	35	8	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	9
17	Água 500ml	Sem gás	2.75	80	20	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	9
19	Café Expresso	Pequeno	4.50	999	0	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	6
20	Cappuccino	Crema	7.90	999	0	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	6
22	Beijinho (un)	Unidade	2.50	80	20	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	10
23	Pudim (fat)	Fatia	7.50	18	6	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	10
25	Donut	Cobertura	6.00	22	8	t	2026-02-23 20:02:45.942	2026-02-23 20:06:05.683	10
3	Pão de Queijo (un)	Unidade	1.50	199	30	t	2026-02-23 20:02:45.942	2026-03-04 15:07:54.064	8
7	Coxinha	Frango	6.90	59	15	t	2026-02-23 20:02:45.942	2026-03-04 15:07:54.078	8
52	Pão Integral	Fatiado	12.90	3	4	t	2026-02-23 20:02:45.942	2026-03-23 14:15:59.175	8
\.


--
-- Data for Name: Venda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Venda" (id, total, "createdAt", "updatedAt", "clienteId", "tipoPagamento", status, "saldoPendente") FROM stdin;
1	2.80	2026-02-23 20:02:45.947	2026-02-23 20:02:45.947	\N	AVISTA	PAGO	0.00
2	17.30	2026-03-04 15:07:54.048	2026-03-23 15:58:19.76	7	FIADO	PAGO	0.00
3	17.40	2026-03-23 15:57:36.834	2026-03-23 15:58:19.762	7	FIADO	PAGO	0.00
4	95.00	2026-03-23 16:30:59.329	2026-03-23 16:30:59.329	\N	AVISTA	PAGO	0.00
5	1.20	2026-03-23 16:44:33.126	2026-03-23 16:44:33.126	\N	CREDITO	PAGO	0.00
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
7eafe537-dcaa-4fac-ba14-c3f8d7788cde	aab05fe39eb2636fae802ba48a1b45c4a36ab17149a2523b1789af9cb92d9f9a	2026-02-23 16:51:54.766269-03	20260223154008_init	\N	\N	2026-02-23 16:51:54.702366-03	1
dc36d9cb-0e00-4356-afe2-419fac66193c	2680e1fb9ef9aa7c1d57c39c3f6d3539406c92400a2fab12dbb3b64c0e991f79	2026-02-23 16:51:54.770995-03	20260223172601_update_venda_cliente_optional	\N	\N	2026-02-23 16:51:54.767175-03	1
198d9820-af05-44d5-9525-0340e521bc90	868a8519bc7232a2e25f5db063619d44336a1a126555687ba4b0ca5747c63d1e	2026-02-23 17:02:34.058917-03	20260223200234_add_enums	\N	\N	2026-02-23 17:02:34.054046-03	1
e322659c-5da3-4b4e-8ade-044593b88373	453778a044ef65819c72701cd092fe6f7ce6becf1a5846a56361f7fc4e371fa8	2026-02-24 11:34:47.463626-03	20260224143447_add_enum	\N	\N	2026-02-24 11:34:47.459085-03	1
17a390db-0168-460d-a7fd-38e48b154b6c	fb0be740fc5a9936a6da91c335c9bfe71350cf50b43c51b7e46e9fe79dcfe7ea	2026-02-24 13:57:07.409436-03	20260224165707_add_saldo_pendente_in_venda	\N	\N	2026-02-24 13:57:07.406072-03	1
\.


--
-- Name: Cliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Cliente_id_seq"', 7, true);


--
-- Name: Fornecedor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Fornecedor_id_seq"', 11, true);


--
-- Name: ItemVenda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ItemVenda_id_seq"', 11, true);


--
-- Name: MovimentacaoEstoque_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MovimentacaoEstoque_id_seq"', 9, true);


--
-- Name: Pagamento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Pagamento_id_seq"', 2, true);


--
-- Name: Produto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Produto_id_seq"', 52, true);


--
-- Name: Venda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Venda_id_seq"', 5, true);


--
-- Name: Cliente Cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cliente"
    ADD CONSTRAINT "Cliente_pkey" PRIMARY KEY (id);


--
-- Name: Fornecedor Fornecedor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Fornecedor"
    ADD CONSTRAINT "Fornecedor_pkey" PRIMARY KEY (id);


--
-- Name: ItemVenda ItemVenda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ItemVenda"
    ADD CONSTRAINT "ItemVenda_pkey" PRIMARY KEY (id);


--
-- Name: MovimentacaoEstoque MovimentacaoEstoque_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovimentacaoEstoque"
    ADD CONSTRAINT "MovimentacaoEstoque_pkey" PRIMARY KEY (id);


--
-- Name: Pagamento Pagamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pagamento"
    ADD CONSTRAINT "Pagamento_pkey" PRIMARY KEY (id);


--
-- Name: Produto Produto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Produto"
    ADD CONSTRAINT "Produto_pkey" PRIMARY KEY (id);


--
-- Name: Venda Venda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Venda"
    ADD CONSTRAINT "Venda_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: ItemVenda ItemVenda_produtoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ItemVenda"
    ADD CONSTRAINT "ItemVenda_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES public."Produto"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ItemVenda ItemVenda_vendaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ItemVenda"
    ADD CONSTRAINT "ItemVenda_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES public."Venda"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MovimentacaoEstoque MovimentacaoEstoque_produtoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovimentacaoEstoque"
    ADD CONSTRAINT "MovimentacaoEstoque_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES public."Produto"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Pagamento Pagamento_clienteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pagamento"
    ADD CONSTRAINT "Pagamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES public."Cliente"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Produto Produto_fornecedorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Produto"
    ADD CONSTRAINT "Produto_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES public."Fornecedor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Venda Venda_clienteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Venda"
    ADD CONSTRAINT "Venda_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES public."Cliente"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict QVgVMVUgUrhqOWdTBhz9F8sFsxkPMxFNW3STTtd0W0Xtksa3pfFP3oJpk9LtJUK

