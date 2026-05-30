-- Auto-run khi PostgreSQL container khởi động lần đầu
-- PostgreSQL version của STUDENTREG.sql

CREATE TABLE IF NOT EXISTS tutor (
  tut_id VARCHAR(10) NOT NULL PRIMARY KEY,
  tname  VARCHAR(45) NOT NULL,
  dob    DATE        NOT NULL,
  hours  DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS student (
  sid      VARCHAR(10) NOT NULL PRIMARY KEY,
  sname    VARCHAR(30),
  email    VARCHAR(30),
  tutor_id VARCHAR(10) REFERENCES tutor(tut_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS modules (
  mid          VARCHAR(15) NOT NULL PRIMARY KEY,
  mname        VARCHAR(40),
  level        VARCHAR(2),
  tutor_tut_id VARCHAR(10) REFERENCES tutor(tut_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS student_enrolement (
  sid       VARCHAR(10) NOT NULL REFERENCES student(sid),
  mid       VARCHAR(15) NOT NULL REFERENCES modules(mid),
  acad_year VARCHAR(10),
  PRIMARY KEY (sid, mid, acad_year)
);

CREATE TABLE IF NOT EXISTS topics (
  tid   SERIAL PRIMARY KEY,
  tdesc VARCHAR(100),
  mod_id VARCHAR(15) REFERENCES modules(mid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS learn_preference (
  tpreference VARCHAR(50),
  apreference VARCHAR(50),
  stud_id     VARCHAR(10) REFERENCES student(sid) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ── DATA ──────────────────────────────────────────────────────
INSERT INTO tutor VALUES
  ('1000','Rong Yang','1982-01-01',4),
  ('1001','Kun Wei','1987-01-01',3),
  ('1002','Kamran Soomro','1985-01-01',4),
  ('1003','Jun Hong','1970-01-01',1),
  ('1004','Zaheer Khan','1980-01-10',null),
  ('1005','Martin Serpell','1981-01-31',null),
  ('1006','Elias Piminides','1980-02-02',null),
  ('1007','Jim Smith','1970-02-02',null),
  ('1008','Barkha Javed','1995-01-01',null),
  ('1009','Shelan Jeawak','1995-02-02',null)
ON CONFLICT DO NOTHING;

INSERT INTO student VALUES
  ('1000','Abdul Basit Chaudhry','abc@abc.com','1003'),
  ('1001','Daniel Everret Fernandes','def@def.com','1000'),
  ('1002','Gigi Hadi Ingram','ghi@ghi.com','1001'),
  ('1003','Jacob Knowle Lewis','jkl@jkl.com','1002'),
  ('1004','Martin Newton Oolu','mno@mno.com','1002'),
  ('1005','Patrick Quinn Rogers','pqr@pqr.com','1002'),
  ('1006','Shabaz Tanveer Ucch','stu@stu.com','1001'),
  ('1007','Umar Victor Qayyum','uvq@stu.com','1001'),
  ('1008','Qais Russell Stuart','qrs@qrs.com','1000'),
  ('1009','Rachel Shaw Trump','rst@rst.com','1000'),
  ('1010','Tania Uno Victoria','tuv@tuv.com','1000'),
  ('1011','Umber Vishal Xavier','uvx@uvx.com','1002'),
  ('1012','James Baker','jb@jb.com',null)
ON CONFLICT DO NOTHING;

INSERT INTO modules VALUES
  ('101','Web Programming','1','1004'),
  ('102','Web Design','1','1000'),
  ('103','CMS','1','1000'),
  ('104','E-Commerce','1','1000'),
  ('105','Advanced Programming','2','1002'),
  ('106','Advanced Databases','2','1006'),
  ('107','Artificial Intelligence','2','1005'),
  ('108','Machine Learning','2','1005'),
  ('109','Data Science','2','1002'),
  ('110','Project Workshops','3','1006'),
  ('111','Data Analytics and Visualisation','3','1002'),
  ('112','Distributed and Parallel computing','3','1004'),
  ('114','Cyber Security','3','1006'),
  ('115','Deep Learning','3','1002'),
  ('116','Computing Project','3','1004'),
  ('117','Placement','3','1001'),
  ('118','Requirements Engineering','3','1001'),
  ('119','Web Development and DB','1',null),
  ('120','Networks','3',null)
ON CONFLICT DO NOTHING;

INSERT INTO student_enrolement VALUES
  ('1000','101','2014-2015'),('1000','102','2014-2015'),
  ('1001','101','2014-2015'),('1001','103','2014-2015'),('1001','104','2014-2015'),
  ('1002','104','2014-2015'),('1000','105','2015-2016'),('1000','106','2015-2016'),
  ('1001','107','2015-2016'),('1001','108','2015-2016'),('1002','103','2015-2016'),
  ('1002','105','2015-2016'),('1003','110','2015-2016'),('1003','111','2015-2016'),
  ('1004','103','2015-2016'),('1004','105','2015-2016'),('1004','110','2015-2016'),
  ('1004','115','2015-2016'),('1005','117','2016-2017'),('1006','117','2017-2018'),
  ('1007','117','2017-2018'),('1005','116','2018-2019'),('1007','116','2018-2019'),
  ('1007','115','2018-2019'),('1007','114','2018-2019')
ON CONFLICT DO NOTHING;
