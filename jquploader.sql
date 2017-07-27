-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-07-2017 a las 23:04:31
-- Versión del servidor: 10.1.19-MariaDB
-- Versión de PHP: 7.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `jquploader`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `archivos_enviados`
--

CREATE TABLE `archivos_enviados` (
  `id` int(11) NOT NULL,
  `id_de_envio` int(11) NOT NULL,
  `nombre_de_archivo` varchar(100) NOT NULL,
  `nombre_de_original` varchar(100) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `peso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `campos_de_archivos`
--

CREATE TABLE `campos_de_archivos` (
  `id` int(11) NOT NULL,
  `archivo_asociado` int(11) NOT NULL,
  `nombre_de_dato` varchar(100) NOT NULL,
  `valor_de_dato` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `otros_campos`
--

CREATE TABLE `otros_campos` (
  `id` int(11) NOT NULL,
  `id_de_envio` int(11) NOT NULL,
  `nombre_de_campo` varchar(100) NOT NULL,
  `valor_de_campo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `archivos_enviados`
--
ALTER TABLE `archivos_enviados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `indice_nombre_de_archivo` (`nombre_de_archivo`),
  ADD KEY `indice_tipo` (`tipo`),
  ADD KEY `indice_peso` (`peso`),
  ADD KEY `indice_id_de_envio` (`id_de_envio`),
  ADD KEY `indice_nombre_de_original` (`nombre_de_original`);

--
-- Indices de la tabla `campos_de_archivos`
--
ALTER TABLE `campos_de_archivos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `indice_archivo_asociado` (`archivo_asociado`),
  ADD KEY `indice_nombre_de_dato` (`nombre_de_dato`),
  ADD KEY `indice_valor_de_dato` (`valor_de_dato`);

--
-- Indices de la tabla `otros_campos`
--
ALTER TABLE `otros_campos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `indice_nombre_de_campo` (`nombre_de_campo`),
  ADD KEY `indice_valor_de_campo` (`valor_de_campo`),
  ADD KEY `indice_id_de_envio` (`id_de_envio`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `archivos_enviados`
--
ALTER TABLE `archivos_enviados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `campos_de_archivos`
--
ALTER TABLE `campos_de_archivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `otros_campos`
--
ALTER TABLE `otros_campos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
