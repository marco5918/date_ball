SET FOREIGN_KEY_CHECKS = 0;
drop table if exists court;
drop table if exists game;
drop table if exists game_member_info;
drop table if exists game_moment;
drop table if exists hobby_basketball_info;
drop table if exists me;
drop table if exists message;
drop table if exists pk;
drop table if exists player;
drop table if exists team;
SET FOREIGN_KEY_CHECKS = 1;

create table court
(
   id                   bigint(20) not null auto_increment,
   court_img            varchar(255) not null,
   court_name           varchar(255) not null,
   court_addr           varchar(255) not null,
   court_price          varchar(255) not null,
   num                  int not null,
   open_time            varchar(255) not null,
   contact              varchar(255) not null,
   remark               varchar(1024),
   position             varchar(255) not null,
   primary key (id)
);

create table game
(
   id                   bigint(20) not null auto_increment,
   game_type            int not null comment '1=队内训练 2=比赛',
   game_datetime        timestamp not null,
   home_team_id         bigint(20) not null,
   guest_team_id        bigint(20) not null,
   primary key (id)
);

create table game_member_info
(
   id                   bigint(20) not null auto_increment,
   game_id              bigint(20) not null,
   team_id              bigint(20) not null,
   play_id              bigint(20) not null,
   points               int,
   rebound              int,
   assist               int,
   block                int,
   steal                int,
   three_point_hit      int,
   primary key (id)
);

create table game_moment
(
   id                   bigint(20) not null auto_increment,
   game_id              bigint(20),
   uploader             bigint(20) not null,
   type                 int not null comment '1=精彩图片
            2=精彩短视频',
   source               varchar(255) not null,
   primary key (id)
);


create table hobby_basketball_info
(
   id                   bigint(20) not null auto_increment,
   height               int not null comment 'cm',
   weight               int not null,
   jersey_number        int not null,
   position             varchar(10) not null,
   nba_team             varchar(255) not null,
   love_star            varchar(255) not null,
   strong_point         varchar(255) not null,
   primary key (id)
);

alter table hobby_basketball_info comment '约篮球，就是有关篮球的信息
';


create table me
(
   id                   bigint(20) not null auto_increment,
   phone                varchar(20) not null,
   login_user           varchar(255) not null,
   password             varchar(255) not null,
   favicon              varchar(255),
   name                 varchar(255) not null,
   nick_name            varchar(255) not null,
   city                 varchar(255) not null,
   age                  int not null,
   gender               smallint not null,
   job                  varchar(255) not null,
   hobby                varchar(255) not null,
   info_id              bigint(20),
   create_time          timestamp DEFAULT NULL,
   modified_time        timestamp DEFAULT NULL,
   last_login_time      timestamp DEFAULT NULL,
   primary key (id)
);

alter table me comment '我的基本信息';


create table message
(
   id                   bigint(20) not null auto_increment,
   level                int not null,
   date_time            timestamp not null,
   message              varchar(1024) not null,
   action               varchar(512),
   recv_id              varchar(1024),
   primary key (id)
);


create table pk
(
   id                   bigint(20) not null auto_increment,
   select_self_team     bigint(20) not null,
   select_team          bigint(20),
   select_court         bigint(20) not null,
   type                 int not null comment '1=队内训练
            2=约战',
   reply                int comment '1=未答复
            2=同意
            3=拒绝
            4=过期',
   start_datetime       timestamp not null,
   last_answer_datetime timestamp not null,
   contact_name         varchar(255) not null,
   contact_phone        varchar(255) not null,
   comment              varchar(2048),
   primary key (id)
);


create table player
(
   id                   bigint(20) not null auto_increment,
   me_id                bigint(20) not null,
   team_title           int not null comment '1=队长， 2=副队长， 3=球员',
   状态                   int not null comment '1=已加入
            2=已退队
            3=申请入队',
   game_count           int not null,
   avg_points           double not null,
   total_points         int not null,
   avg_rebound          double not null,
   total_rebound        int not null,
   avg_assist           double not null,
   total_assist         int not null,
   avg_block            double not null,
   total_block          int not null,
   avg_steal            double not null,
   total_steal          int not null,
   avg_three_point_hit  double not null,
   total_three_point_hit int not null,
   scoring_leader       int not null,
   rebound_leader       int not null,
   assisting_leader     int not null,
   blocking_leader      int not null,
   stealing_leader      int not null,
   primary key (id)
);


create table team
(
   id                   bigint(20) not null auto_increment,
   team_name            varchar(255) not null,
   team_logo            varchar(255) not null,
   team_city            varchar(255) not null,
   team_info            varchar(2048),
   match_num            int not null,
   train_num            int not null,
   winning_rate         double not null,
   primary key (id)
);

alter table game_member_info add constraint FK_game_game_r foreign key (game_id)
      references game (id) on delete restrict on update restrict;

alter table game_member_info add constraint FK_game_player_r foreign key (play_id)
      references player (id) on delete restrict on update restrict;

alter table game_member_info add constraint FK_player_team_r foreign key (team_id)
      references team (id) on delete restrict on update restrict;

alter table game_moment add constraint FK_moment_game_r foreign key (game_id)
      references game (id) on delete restrict on update restrict;

alter table game_moment add constraint FK_moment_player_r foreign key (uploader)
      references player (id) on delete restrict on update restrict;

alter table hobby_basketball_info add constraint FK_me_basketball_r foreign key (me_id)
      references me(id) on delete restrict on update restrict;

alter table pk add constraint FK_pk_court_r foreign key (select_court)
      references court (id) on delete restrict on update restrict;

alter table pk add constraint FK_pk_team_r foreign key (select_self_team)
      references team (id) on delete restrict on update restrict;

alter table pk add constraint FK_pk_team_r2 foreign key (select_team)
      references team (id) on delete restrict on update restrict;

alter table player add constraint FK_palyer_me_r foreign key (me_id)
      references me (id) on delete restrict on update restrict;
