package fr.im2ag.m2cci.pipoc.config;

import java.io.Console;
import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Bean peremttant de configurer la conneion à la base de données PostgesSQL
 * en laissant le choix  à l'utilisateur entre une base locale ou la base de l'IUGA
 */
@Configuration
public class DataSourceConfig {

    //  recupération du Logger pour afficher les traces d'exécution sur la console
    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);

    // récupéation des valeurs par défaut définie dans le fichier application.properties
    // pour la configuration du pilote (driver) JDBC

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String userName;

    @Value("${spring.datasource.password}")
    private String userPassword;

    /**
     * Permet de créer interactivement une DataSource pour l'obtention des connexions JDBC
     * en demandant de choisir entre une datasource utilisant les informations de connexion
     * définies dans application.properties (on ne demande alors rien à l'utilisateur) ou
     * une datasource pour une connexion à la bases de données PostgreSQL de l'IUGA (dans ce cas
     * l'utilisateur doit fournir son identifiant et mot de passe).
     * 
     * @return la dataSource créée.
     */
    @Bean
    public DataSource getDataSource() {
        logger.info("Configuration de la DataSource pour accéder à la base de données ");
        Console console = System.console();
        DataSourceBuilder<?> dataSourceBuilder = DataSourceBuilder.create();
        DataSource ds = null;

        if (console == null) {
            // 无法获取交互式终端（如通过IDE或Maven插件启动），直接使用application.properties中的默认配置
            logger.info("无法获取控制台，使用application.properties中的默认数据库配置");
        } else {
            String connectionMode = console.readLine("Connexion BD IUGA O/N (O défaut, N utilisation de application.propertie)? ");
            if ( connectionMode.isBlank() || connectionMode.matches("(?i)[yo].*")) {
                logger.info("Connexion à une BD IUGA");
                String bdName = console.readLine("Nom de la base de données (bd_xxx où xxx est un identifiant de l'utilisateur): ");
                userName = console.readLine("Identifiant (identifiant d'un utilisateur ayant les droits sur la bd) : ");
                char[] passwordArray = console.readPassword("Mot de passe : ");
                driverClassName = "org.postgresql.Driver";
                url = "jdbc:postgresql://129.88.175.104:5432/" + bdName;
                userPassword= new String(passwordArray);
            }
        }

        dataSourceBuilder.driverClassName(driverClassName);
        dataSourceBuilder.url(url);
        dataSourceBuilder.username(userName);
        dataSourceBuilder.password(userPassword);
        ds = dataSourceBuilder.build();
        // vérifie si la connexion à la BD fonctionne
        try (Connection con = ds.getConnection()) {
            logger.info("Connexion à la BD OK");
        } catch (SQLException ex) {
            logger.error("Echec connexion à la BD", ex);
            System.exit(0);  // on arrête le serveur
        }
        return ds;
    }
}