create schema inventorisation collate utf8mb4_general_ci;
use inventorisation

create table category
(
    id          int auto_increment
        primary key,
    title       varchar(255) not null,
    description text         null
);

create table location
(
    id          int auto_increment
        primary key,
    title       varchar(255) not null,
    description text         null
);

create table record
(
    id          int auto_increment
        primary key,
    category_id int                                not null,
    location_id int                                not null,
    title       varchar(255)                       not null,
    description varchar(255)                       null,
    image       varchar(255)                       null,
    created_at  datetime default CURRENT_TIMESTAMP null,
    constraint record_category_id_fk
        foreign key (category_id) references category (id),
    constraint record_location_id_fk
        foreign key (location_id) references location (id)
);

