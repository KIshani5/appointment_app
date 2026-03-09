-- users table
create table users(
id serial primary key,
name varchar(80) not null,
email varchar(80) unique not null,
password varchar(255) not null,
role varchar(10) default 'user' check(role in ('admin','user')),
created_time timestamp default now()
);

-- services
create table services(
id serial primary key,
service_name varchar(30) not null,
description text,
duration_minutes int default 15,
created_time timestamp default now()
);

-- appointments
create table appointments(
id serial primary key,
user_id int references users(id) on delete cascade,
servicec_id int references services(id) on delete cascade,
appointment_date date not null,
appointment_time time not null,
status varchar(20) default 'pending' check(status in('pending','approved','rejected')),
details text,
created_time timestamp default now()
);

-- admin add
insert into users(name,email,password,role)
values('Admin','admin@abc.com','abc@123','admin')

-- users
select * from users;
-- user details
select id, name, email, role from users where role = 'admin';

-- services
select * from services;

-- appointments
select * from appointments;
