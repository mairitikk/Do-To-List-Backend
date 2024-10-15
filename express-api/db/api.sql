CREATE TABLE `users` (
  `id`       int(11)     unsigned NOT NULL AUTO_INCREMENT,
  `name`     varchar(30) DEFAULT '',
  `email`    varchar(50) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;