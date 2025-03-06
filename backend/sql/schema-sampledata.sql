-- MySQL dump 10.13  Distrib 8.0.14, for macos10.14 (x86_64)
--
-- Host: localhost    Database: 2021-mnts
-- ------------------------------------------------------
-- Server version	8.0.14

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `mountain`
--

DROP TABLE IF EXISTS `mountain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `mountain` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `elevation` float DEFAULT NULL,
  `hasmountainrailway` tinyint(1) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `mountain_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mountain`
--

LOCK TABLES `mountain` WRITE;
/*!40000 ALTER TABLE `mountain` DISABLE KEYS */;
INSERT INTO `mountain` VALUES (1,'Eiger',8.00538,46.5776,3967,0,'eiger.jpg','2021-10-14 10:10:23','2021-10-14 10:10:23',NULL),(2,'Monte Generoso',9.02016,45.9315,1701,1,'generoso.jpg','2021-10-14 10:10:23','2021-10-14 10:10:23',NULL),(3,'Matterhorn',7.65843,45.9767,4477,0,'matterhorn.jpg','2021-10-14 10:10:23','2021-10-14 10:10:23',NULL),(4,'Bristen',8.68128,46.737,3073,0,'bristen.jpg','2021-10-14 10:10:23','2021-10-14 10:10:23',NULL),(5,'Niederhorn',7.77534,46.7113,1963,1,'niederhorn.jpg','2021-10-14 10:10:23','2021-10-14 10:10:23',NULL),(6,'Piz Bernina',9.90812,46.3823,4049,0,'pizbernina.jpg','2021-10-14 10:10:23','2021-10-14 10:10:23',NULL),(7,'Rigi',8.48522,47.0567,1798,1,'rigi.jpg','2021-10-14 10:10:23','2021-10-14 10:10:23',NULL),(8,'Säntis',9.34326,47.2494,2502,1,'santis.jpg','2021-10-14 10:10:23','2021-10-14 10:10:23',NULL),(9,'Titlis',8.43777,46.7721,3238,1,'titlis.jpg','2021-10-14 10:10:23','2021-10-14 10:10:23',NULL),(10,'Tödi',8.91487,46.8111,3614,0,'todi.jpg','2021-10-14 10:10:23','2021-10-14 10:10:23',NULL),(11,'Tschingelhörner',9.22125,46.8983,2849,0,'tschingelhorner.jpg','2021-10-14 10:10:23','2021-10-14 10:10:23',NULL),(12,'Uetliberg',8.49205,47.3495,870,1,'uetliberg.jpg','2021-10-14 10:10:23','2021-10-14 10:10:23',NULL),(13,'Gärnisch',8.98884,46.9928,2914,1,'glarnisch.jpg','2021-10-14 10:10:23','2021-10-14 10:10:23',NULL);
/*!40000 ALTER TABLE `mountain` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `pwd` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Grady','Booch','gbo@oonet.com','$2b$10$mrPqooFJTgHeLNx7VlqtCezAgnkr599xNnA5z91RS3BSIxHjN4pH.','avatar09.svg','2021-10-14 10:10:23','2021-10-14 10:10:23'),(2,'Niklaus','Wirth','nw@inf.ethz.ch','$2b$10$mrPqooFJTgHeLNx7VlqtCezAgnkr599xNnA5z91RS3BSIxHjN4pH.','avatar04.svg','2021-10-14 10:10:23','2021-10-14 10:10:23'),(3,'Dennis','Ritchie','dr@bell.org','$2b$10$mrPqooFJTgHeLNx7VlqtCezAgnkr599xNnA5z91RS3BSIxHjN4pH.','avatar05.svg','2021-10-14 10:10:23','2021-10-14 10:10:23'),(4,'Edgar','Codd','ec@oxf.edu','$2b$10$mrPqooFJTgHeLNx7VlqtCezAgnkr599xNnA5z91RS3BSIxHjN4pH.','avatar06.svg','2021-10-14 10:10:24','2021-10-14 10:10:24'),(5,'Marie','Harrison','mh@bbc.co.uk','$2b$10$mrPqooFJTgHeLNx7VlqtCezAgnkr599xNnA5z91RS3BSIxHjN4pH.','avatar01.svg','2021-10-14 10:10:24','2021-10-14 10:10:24');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-10-14 12:21:26
