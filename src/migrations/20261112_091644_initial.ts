import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_order_idx\` ON \`pages_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_parent_id_idx\` ON \`pages_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_path_idx\` ON \`pages_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_order_idx\` ON \`pages_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_parent_id_idx\` ON \`pages_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_path_idx\` ON \`pages_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_image_idx\` ON \`pages_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_items_order_idx\` ON \`pages_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_items_parent_id_idx\` ON \`pages_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_items_image_idx\` ON \`pages_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_order_idx\` ON \`pages_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_parent_id_idx\` ON \`pages_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_path_idx\` ON \`pages_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_order_idx\` ON \`pages_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_parent_id_idx\` ON \`pages_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_path_idx\` ON \`pages_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_poster_idx\` ON \`pages_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_audio_order_idx\` ON \`pages_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_audio_parent_id_idx\` ON \`pages_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_audio_path_idx\` ON \`pages_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_audio_track_idx\` ON \`pages_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_chart_order_idx\` ON \`pages_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_chart_parent_id_idx\` ON \`pages_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_chart_path_idx\` ON \`pages_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_chart_image_idx\` ON \`pages_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_comic_reader_images_order_idx\` ON \`pages_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comic_reader_images_parent_id_idx\` ON \`pages_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comic_reader_images_image_idx\` ON \`pages_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_comic_reader_order_idx\` ON \`pages_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comic_reader_parent_id_idx\` ON \`pages_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_comic_reader_path_idx\` ON \`pages_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_file_download_order_idx\` ON \`pages_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_file_download_parent_id_idx\` ON \`pages_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_file_download_path_idx\` ON \`pages_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_file_download_file_idx\` ON \`pages_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`excerpt\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_canonical\` text,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_site_idx\` ON \`pages\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_seo_seo_image_idx\` ON \`pages\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_order_idx\` ON \`_pages_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_parent_id_idx\` ON \`_pages_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_path_idx\` ON \`_pages_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_order_idx\` ON \`_pages_v_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_parent_id_idx\` ON \`_pages_v_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_path_idx\` ON \`_pages_v_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_image_idx\` ON \`_pages_v_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_items_order_idx\` ON \`_pages_v_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_items_parent_id_idx\` ON \`_pages_v_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_items_image_idx\` ON \`_pages_v_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_order_idx\` ON \`_pages_v_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_parent_id_idx\` ON \`_pages_v_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_path_idx\` ON \`_pages_v_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_order_idx\` ON \`_pages_v_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_parent_id_idx\` ON \`_pages_v_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_path_idx\` ON \`_pages_v_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_poster_idx\` ON \`_pages_v_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_audio_order_idx\` ON \`_pages_v_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_audio_parent_id_idx\` ON \`_pages_v_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_audio_path_idx\` ON \`_pages_v_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_audio_track_idx\` ON \`_pages_v_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_chart_order_idx\` ON \`_pages_v_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_chart_parent_id_idx\` ON \`_pages_v_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_chart_path_idx\` ON \`_pages_v_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_chart_image_idx\` ON \`_pages_v_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comic_reader_images_order_idx\` ON \`_pages_v_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comic_reader_images_parent_id_idx\` ON \`_pages_v_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comic_reader_images_image_idx\` ON \`_pages_v_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comic_reader_order_idx\` ON \`_pages_v_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comic_reader_parent_id_idx\` ON \`_pages_v_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_comic_reader_path_idx\` ON \`_pages_v_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_file_download_order_idx\` ON \`_pages_v_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_file_download_parent_id_idx\` ON \`_pages_v_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_file_download_path_idx\` ON \`_pages_v_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_file_download_file_idx\` ON \`_pages_v_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_site_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_excerpt\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_canonical\` text,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_site_idx\` ON \`_pages_v\` (\`version_site_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_seo_version_seo_image_idx\` ON \`_pages_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_autosave_idx\` ON \`_pages_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_rich_text_order_idx\` ON \`articles_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_rich_text_parent_id_idx\` ON \`articles_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_rich_text_path_idx\` ON \`articles_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_image_order_idx\` ON \`articles_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_image_parent_id_idx\` ON \`articles_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_image_path_idx\` ON \`articles_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_image_image_idx\` ON \`articles_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_gallery_items_order_idx\` ON \`articles_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_gallery_items_parent_id_idx\` ON \`articles_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_gallery_items_image_idx\` ON \`articles_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_gallery_order_idx\` ON \`articles_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_gallery_parent_id_idx\` ON \`articles_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_gallery_path_idx\` ON \`articles_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_video_order_idx\` ON \`articles_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_video_parent_id_idx\` ON \`articles_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_video_path_idx\` ON \`articles_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_video_poster_idx\` ON \`articles_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_audio_order_idx\` ON \`articles_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_audio_parent_id_idx\` ON \`articles_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_audio_path_idx\` ON \`articles_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_audio_track_idx\` ON \`articles_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_chart_order_idx\` ON \`articles_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_chart_parent_id_idx\` ON \`articles_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_chart_path_idx\` ON \`articles_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_chart_image_idx\` ON \`articles_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_comic_reader_images_order_idx\` ON \`articles_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_comic_reader_images_parent_id_idx\` ON \`articles_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_comic_reader_images_image_idx\` ON \`articles_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_comic_reader_order_idx\` ON \`articles_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_comic_reader_parent_id_idx\` ON \`articles_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_comic_reader_path_idx\` ON \`articles_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`articles_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_blocks_file_download_order_idx\` ON \`articles_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_file_download_parent_id_idx\` ON \`articles_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_file_download_path_idx\` ON \`articles_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`articles_blocks_file_download_file_idx\` ON \`articles_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`articles\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`excerpt\` text,
  	\`cover_id\` integer,
  	\`source_name\` text,
  	\`source_url\` text,
  	\`published_date\` text,
  	\`featured_rank\` numeric,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_canonical\` text,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_site_idx\` ON \`articles\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_slug_idx\` ON \`articles\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`articles_cover_idx\` ON \`articles\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_seo_seo_image_idx\` ON \`articles\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_updated_at_idx\` ON \`articles\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`articles_created_at_idx\` ON \`articles\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`articles__status_idx\` ON \`articles\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`articles_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_rels_order_idx\` ON \`articles_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_parent_idx\` ON \`articles_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_path_idx\` ON \`articles_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`articles_rels_terms_id_idx\` ON \`articles_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_rich_text_order_idx\` ON \`_articles_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_rich_text_parent_id_idx\` ON \`_articles_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_rich_text_path_idx\` ON \`_articles_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_image_order_idx\` ON \`_articles_v_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_image_parent_id_idx\` ON \`_articles_v_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_image_path_idx\` ON \`_articles_v_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_image_image_idx\` ON \`_articles_v_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_gallery_items_order_idx\` ON \`_articles_v_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_gallery_items_parent_id_idx\` ON \`_articles_v_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_gallery_items_image_idx\` ON \`_articles_v_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_gallery_order_idx\` ON \`_articles_v_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_gallery_parent_id_idx\` ON \`_articles_v_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_gallery_path_idx\` ON \`_articles_v_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_video_order_idx\` ON \`_articles_v_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_video_parent_id_idx\` ON \`_articles_v_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_video_path_idx\` ON \`_articles_v_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_video_poster_idx\` ON \`_articles_v_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_audio_order_idx\` ON \`_articles_v_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_audio_parent_id_idx\` ON \`_articles_v_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_audio_path_idx\` ON \`_articles_v_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_audio_track_idx\` ON \`_articles_v_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_chart_order_idx\` ON \`_articles_v_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_chart_parent_id_idx\` ON \`_articles_v_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_chart_path_idx\` ON \`_articles_v_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_chart_image_idx\` ON \`_articles_v_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_comic_reader_images_order_idx\` ON \`_articles_v_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_comic_reader_images_parent_id_idx\` ON \`_articles_v_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_comic_reader_images_image_idx\` ON \`_articles_v_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_comic_reader_order_idx\` ON \`_articles_v_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_comic_reader_parent_id_idx\` ON \`_articles_v_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_comic_reader_path_idx\` ON \`_articles_v_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_file_download_order_idx\` ON \`_articles_v_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_file_download_parent_id_idx\` ON \`_articles_v_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_file_download_path_idx\` ON \`_articles_v_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_blocks_file_download_file_idx\` ON \`_articles_v_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_site_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_excerpt\` text,
  	\`version_cover_id\` integer,
  	\`version_source_name\` text,
  	\`version_source_url\` text,
  	\`version_published_date\` text,
  	\`version_featured_rank\` numeric,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_canonical\` text,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_parent_idx\` ON \`_articles_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_site_idx\` ON \`_articles_v\` (\`version_site_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_slug_idx\` ON \`_articles_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_cover_idx\` ON \`_articles_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_seo_version_seo_image_idx\` ON \`_articles_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_updated_at_idx\` ON \`_articles_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_created_at_idx\` ON \`_articles_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version__status_idx\` ON \`_articles_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_created_at_idx\` ON \`_articles_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_updated_at_idx\` ON \`_articles_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_latest_idx\` ON \`_articles_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_autosave_idx\` ON \`_articles_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_order_idx\` ON \`_articles_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_parent_idx\` ON \`_articles_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_path_idx\` ON \`_articles_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_rels_terms_id_idx\` ON \`_articles_v_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`tutorials_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tutorials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_rich_text_order_idx\` ON \`tutorials_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_rich_text_parent_id_idx\` ON \`tutorials_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_rich_text_path_idx\` ON \`tutorials_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`tutorials_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tutorials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_image_order_idx\` ON \`tutorials_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_image_parent_id_idx\` ON \`tutorials_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_image_path_idx\` ON \`tutorials_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_image_image_idx\` ON \`tutorials_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`tutorials_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tutorials_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_gallery_items_order_idx\` ON \`tutorials_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_gallery_items_parent_id_idx\` ON \`tutorials_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_gallery_items_image_idx\` ON \`tutorials_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`tutorials_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tutorials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_gallery_order_idx\` ON \`tutorials_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_gallery_parent_id_idx\` ON \`tutorials_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_gallery_path_idx\` ON \`tutorials_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`tutorials_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tutorials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_video_order_idx\` ON \`tutorials_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_video_parent_id_idx\` ON \`tutorials_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_video_path_idx\` ON \`tutorials_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_video_poster_idx\` ON \`tutorials_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`tutorials_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tutorials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_audio_order_idx\` ON \`tutorials_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_audio_parent_id_idx\` ON \`tutorials_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_audio_path_idx\` ON \`tutorials_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_audio_track_idx\` ON \`tutorials_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`tutorials_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tutorials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_chart_order_idx\` ON \`tutorials_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_chart_parent_id_idx\` ON \`tutorials_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_chart_path_idx\` ON \`tutorials_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_chart_image_idx\` ON \`tutorials_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`tutorials_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tutorials_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_comic_reader_images_order_idx\` ON \`tutorials_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_comic_reader_images_parent_id_idx\` ON \`tutorials_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_comic_reader_images_image_idx\` ON \`tutorials_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`tutorials_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tutorials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_comic_reader_order_idx\` ON \`tutorials_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_comic_reader_parent_id_idx\` ON \`tutorials_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_comic_reader_path_idx\` ON \`tutorials_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`tutorials_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tutorials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_file_download_order_idx\` ON \`tutorials_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_file_download_parent_id_idx\` ON \`tutorials_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_file_download_path_idx\` ON \`tutorials_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_blocks_file_download_file_idx\` ON \`tutorials_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`tutorials\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`excerpt\` text,
  	\`cover_id\` integer,
  	\`duration_minutes\` numeric,
  	\`published_date\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_canonical\` text,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`tutorials_site_idx\` ON \`tutorials\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_slug_idx\` ON \`tutorials\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_cover_idx\` ON \`tutorials\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_seo_seo_image_idx\` ON \`tutorials\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_updated_at_idx\` ON \`tutorials\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_created_at_idx\` ON \`tutorials\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`tutorials__status_idx\` ON \`tutorials\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`tutorials_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	\`tools_id\` integer,
  	\`products_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`tutorials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tools_id\`) REFERENCES \`tools\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tutorials_rels_order_idx\` ON \`tutorials_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_rels_parent_idx\` ON \`tutorials_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_rels_path_idx\` ON \`tutorials_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_rels_terms_id_idx\` ON \`tutorials_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_rels_tools_id_idx\` ON \`tutorials_rels\` (\`tools_id\`);`)
  await db.run(sql`CREATE INDEX \`tutorials_rels_products_id_idx\` ON \`tutorials_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE TABLE \`_tutorials_v_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tutorials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_rich_text_order_idx\` ON \`_tutorials_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_rich_text_parent_id_idx\` ON \`_tutorials_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_rich_text_path_idx\` ON \`_tutorials_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_tutorials_v_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tutorials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_image_order_idx\` ON \`_tutorials_v_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_image_parent_id_idx\` ON \`_tutorials_v_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_image_path_idx\` ON \`_tutorials_v_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_image_image_idx\` ON \`_tutorials_v_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_tutorials_v_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tutorials_v_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_gallery_items_order_idx\` ON \`_tutorials_v_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_gallery_items_parent_id_idx\` ON \`_tutorials_v_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_gallery_items_image_idx\` ON \`_tutorials_v_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_tutorials_v_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tutorials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_gallery_order_idx\` ON \`_tutorials_v_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_gallery_parent_id_idx\` ON \`_tutorials_v_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_gallery_path_idx\` ON \`_tutorials_v_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_tutorials_v_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tutorials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_video_order_idx\` ON \`_tutorials_v_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_video_parent_id_idx\` ON \`_tutorials_v_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_video_path_idx\` ON \`_tutorials_v_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_video_poster_idx\` ON \`_tutorials_v_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`_tutorials_v_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tutorials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_audio_order_idx\` ON \`_tutorials_v_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_audio_parent_id_idx\` ON \`_tutorials_v_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_audio_path_idx\` ON \`_tutorials_v_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_audio_track_idx\` ON \`_tutorials_v_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`_tutorials_v_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tutorials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_chart_order_idx\` ON \`_tutorials_v_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_chart_parent_id_idx\` ON \`_tutorials_v_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_chart_path_idx\` ON \`_tutorials_v_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_chart_image_idx\` ON \`_tutorials_v_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_tutorials_v_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tutorials_v_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_comic_reader_images_order_idx\` ON \`_tutorials_v_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_comic_reader_images_parent_id_idx\` ON \`_tutorials_v_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_comic_reader_images_image_idx\` ON \`_tutorials_v_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_tutorials_v_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tutorials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_comic_reader_order_idx\` ON \`_tutorials_v_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_comic_reader_parent_id_idx\` ON \`_tutorials_v_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_comic_reader_path_idx\` ON \`_tutorials_v_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_tutorials_v_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tutorials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_file_download_order_idx\` ON \`_tutorials_v_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_file_download_parent_id_idx\` ON \`_tutorials_v_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_file_download_path_idx\` ON \`_tutorials_v_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_blocks_file_download_file_idx\` ON \`_tutorials_v_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`_tutorials_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_site_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_excerpt\` text,
  	\`version_cover_id\` integer,
  	\`version_duration_minutes\` numeric,
  	\`version_published_date\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_canonical\` text,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`tutorials\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_tutorials_v_parent_idx\` ON \`_tutorials_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_version_version_site_idx\` ON \`_tutorials_v\` (\`version_site_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_version_version_slug_idx\` ON \`_tutorials_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_version_version_cover_idx\` ON \`_tutorials_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_version_seo_version_seo_image_idx\` ON \`_tutorials_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_version_version_updated_at_idx\` ON \`_tutorials_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_version_version_created_at_idx\` ON \`_tutorials_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_version_version__status_idx\` ON \`_tutorials_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_created_at_idx\` ON \`_tutorials_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_updated_at_idx\` ON \`_tutorials_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_latest_idx\` ON \`_tutorials_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_autosave_idx\` ON \`_tutorials_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_tutorials_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	\`tools_id\` integer,
  	\`products_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_tutorials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tools_id\`) REFERENCES \`tools\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tutorials_v_rels_order_idx\` ON \`_tutorials_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_rels_parent_idx\` ON \`_tutorials_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_rels_path_idx\` ON \`_tutorials_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_rels_terms_id_idx\` ON \`_tutorials_v_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_rels_tools_id_idx\` ON \`_tutorials_v_rels\` (\`tools_id\`);`)
  await db.run(sql`CREATE INDEX \`_tutorials_v_rels_products_id_idx\` ON \`_tutorials_v_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE TABLE \`tools_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tools\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tools_blocks_rich_text_order_idx\` ON \`tools_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_rich_text_parent_id_idx\` ON \`tools_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_rich_text_path_idx\` ON \`tools_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`tools_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tools\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tools_blocks_image_order_idx\` ON \`tools_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_image_parent_id_idx\` ON \`tools_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_image_path_idx\` ON \`tools_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_image_image_idx\` ON \`tools_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`tools_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tools_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tools_blocks_gallery_items_order_idx\` ON \`tools_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_gallery_items_parent_id_idx\` ON \`tools_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_gallery_items_image_idx\` ON \`tools_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`tools_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tools\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tools_blocks_gallery_order_idx\` ON \`tools_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_gallery_parent_id_idx\` ON \`tools_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_gallery_path_idx\` ON \`tools_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`tools_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tools\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tools_blocks_video_order_idx\` ON \`tools_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_video_parent_id_idx\` ON \`tools_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_video_path_idx\` ON \`tools_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_video_poster_idx\` ON \`tools_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`tools_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tools\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tools_blocks_audio_order_idx\` ON \`tools_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_audio_parent_id_idx\` ON \`tools_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_audio_path_idx\` ON \`tools_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_audio_track_idx\` ON \`tools_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`tools_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tools\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tools_blocks_chart_order_idx\` ON \`tools_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_chart_parent_id_idx\` ON \`tools_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_chart_path_idx\` ON \`tools_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_chart_image_idx\` ON \`tools_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`tools_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tools_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tools_blocks_comic_reader_images_order_idx\` ON \`tools_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_comic_reader_images_parent_id_idx\` ON \`tools_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_comic_reader_images_image_idx\` ON \`tools_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`tools_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tools\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tools_blocks_comic_reader_order_idx\` ON \`tools_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_comic_reader_parent_id_idx\` ON \`tools_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_comic_reader_path_idx\` ON \`tools_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`tools_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tools\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tools_blocks_file_download_order_idx\` ON \`tools_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_file_download_parent_id_idx\` ON \`tools_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_file_download_path_idx\` ON \`tools_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`tools_blocks_file_download_file_idx\` ON \`tools_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`tools_platforms\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tools\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tools_platforms_order_idx\` ON \`tools_platforms\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tools_platforms_parent_id_idx\` ON \`tools_platforms\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tools\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_id\` integer,
  	\`name\` text,
  	\`slug\` text,
  	\`summary\` text,
  	\`url\` text,
  	\`logo_id\` integer,
  	\`pricing\` text DEFAULT 'unknown',
  	\`featured_rank\` numeric,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_canonical\` text,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`tools_site_idx\` ON \`tools\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`tools_slug_idx\` ON \`tools\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`tools_logo_idx\` ON \`tools\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`tools_seo_seo_image_idx\` ON \`tools\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`tools_updated_at_idx\` ON \`tools\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`tools_created_at_idx\` ON \`tools\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`tools__status_idx\` ON \`tools\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`tools_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`tools\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tools_rels_order_idx\` ON \`tools_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`tools_rels_parent_idx\` ON \`tools_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tools_rels_path_idx\` ON \`tools_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`tools_rels_terms_id_idx\` ON \`tools_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`_tools_v_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tools_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_rich_text_order_idx\` ON \`_tools_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_rich_text_parent_id_idx\` ON \`_tools_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_rich_text_path_idx\` ON \`_tools_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_tools_v_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tools_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_image_order_idx\` ON \`_tools_v_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_image_parent_id_idx\` ON \`_tools_v_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_image_path_idx\` ON \`_tools_v_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_image_image_idx\` ON \`_tools_v_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_tools_v_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tools_v_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_gallery_items_order_idx\` ON \`_tools_v_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_gallery_items_parent_id_idx\` ON \`_tools_v_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_gallery_items_image_idx\` ON \`_tools_v_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_tools_v_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tools_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_gallery_order_idx\` ON \`_tools_v_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_gallery_parent_id_idx\` ON \`_tools_v_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_gallery_path_idx\` ON \`_tools_v_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_tools_v_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tools_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_video_order_idx\` ON \`_tools_v_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_video_parent_id_idx\` ON \`_tools_v_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_video_path_idx\` ON \`_tools_v_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_video_poster_idx\` ON \`_tools_v_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`_tools_v_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tools_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_audio_order_idx\` ON \`_tools_v_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_audio_parent_id_idx\` ON \`_tools_v_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_audio_path_idx\` ON \`_tools_v_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_audio_track_idx\` ON \`_tools_v_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`_tools_v_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tools_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_chart_order_idx\` ON \`_tools_v_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_chart_parent_id_idx\` ON \`_tools_v_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_chart_path_idx\` ON \`_tools_v_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_chart_image_idx\` ON \`_tools_v_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_tools_v_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tools_v_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_comic_reader_images_order_idx\` ON \`_tools_v_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_comic_reader_images_parent_id_idx\` ON \`_tools_v_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_comic_reader_images_image_idx\` ON \`_tools_v_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_tools_v_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tools_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_comic_reader_order_idx\` ON \`_tools_v_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_comic_reader_parent_id_idx\` ON \`_tools_v_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_comic_reader_path_idx\` ON \`_tools_v_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_tools_v_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tools_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_file_download_order_idx\` ON \`_tools_v_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_file_download_parent_id_idx\` ON \`_tools_v_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_file_download_path_idx\` ON \`_tools_v_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_blocks_file_download_file_idx\` ON \`_tools_v_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`_tools_v_version_platforms\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tools_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tools_v_version_platforms_order_idx\` ON \`_tools_v_version_platforms\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_version_platforms_parent_id_idx\` ON \`_tools_v_version_platforms\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_tools_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_site_id\` integer,
  	\`version_name\` text,
  	\`version_slug\` text,
  	\`version_summary\` text,
  	\`version_url\` text,
  	\`version_logo_id\` integer,
  	\`version_pricing\` text DEFAULT 'unknown',
  	\`version_featured_rank\` numeric,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_canonical\` text,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`tools\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_tools_v_parent_idx\` ON \`_tools_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_version_version_site_idx\` ON \`_tools_v\` (\`version_site_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_version_version_slug_idx\` ON \`_tools_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_version_version_logo_idx\` ON \`_tools_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_version_seo_version_seo_image_idx\` ON \`_tools_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_version_version_updated_at_idx\` ON \`_tools_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_version_version_created_at_idx\` ON \`_tools_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_version_version__status_idx\` ON \`_tools_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_created_at_idx\` ON \`_tools_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_updated_at_idx\` ON \`_tools_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_latest_idx\` ON \`_tools_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_autosave_idx\` ON \`_tools_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_tools_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_tools_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tools_v_rels_order_idx\` ON \`_tools_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_rels_parent_idx\` ON \`_tools_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_rels_path_idx\` ON \`_tools_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_tools_v_rels_terms_id_idx\` ON \`_tools_v_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_rich_text_order_idx\` ON \`products_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_rich_text_parent_id_idx\` ON \`products_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_rich_text_path_idx\` ON \`products_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_image_order_idx\` ON \`products_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_image_parent_id_idx\` ON \`products_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_image_path_idx\` ON \`products_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_image_image_idx\` ON \`products_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_gallery_items_order_idx\` ON \`products_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_gallery_items_parent_id_idx\` ON \`products_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_gallery_items_image_idx\` ON \`products_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_gallery_order_idx\` ON \`products_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_gallery_parent_id_idx\` ON \`products_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_gallery_path_idx\` ON \`products_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_video_order_idx\` ON \`products_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_video_parent_id_idx\` ON \`products_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_video_path_idx\` ON \`products_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_video_poster_idx\` ON \`products_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_audio_order_idx\` ON \`products_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_audio_parent_id_idx\` ON \`products_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_audio_path_idx\` ON \`products_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_audio_track_idx\` ON \`products_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_chart_order_idx\` ON \`products_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_chart_parent_id_idx\` ON \`products_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_chart_path_idx\` ON \`products_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_chart_image_idx\` ON \`products_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_comic_reader_images_order_idx\` ON \`products_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_comic_reader_images_parent_id_idx\` ON \`products_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_comic_reader_images_image_idx\` ON \`products_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_comic_reader_order_idx\` ON \`products_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_comic_reader_parent_id_idx\` ON \`products_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_comic_reader_path_idx\` ON \`products_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`products_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_blocks_file_download_order_idx\` ON \`products_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_file_download_parent_id_idx\` ON \`products_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_file_download_path_idx\` ON \`products_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`products_blocks_file_download_file_idx\` ON \`products_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`products\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_id\` integer,
  	\`name\` text,
  	\`slug\` text,
  	\`kind\` text DEFAULT 'digital-product',
  	\`summary\` text,
  	\`cover_id\` integer,
  	\`price_label\` text,
  	\`status_label\` text DEFAULT 'coming-soon',
  	\`purchase_url\` text,
  	\`download_id\` integer,
  	\`featured_rank\` numeric,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_canonical\` text,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`download_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`products_site_idx\` ON \`products\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`products_slug_idx\` ON \`products\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`products_cover_idx\` ON \`products\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`products_download_idx\` ON \`products\` (\`download_id\`);`)
  await db.run(sql`CREATE INDEX \`products_seo_seo_image_idx\` ON \`products\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`products_updated_at_idx\` ON \`products\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`products_created_at_idx\` ON \`products\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`products__status_idx\` ON \`products\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`products_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`products_rels_order_idx\` ON \`products_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_parent_idx\` ON \`products_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_path_idx\` ON \`products_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`products_rels_terms_id_idx\` ON \`products_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_rich_text_order_idx\` ON \`_products_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_rich_text_parent_id_idx\` ON \`_products_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_rich_text_path_idx\` ON \`_products_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_image_order_idx\` ON \`_products_v_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_image_parent_id_idx\` ON \`_products_v_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_image_path_idx\` ON \`_products_v_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_image_image_idx\` ON \`_products_v_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_gallery_items_order_idx\` ON \`_products_v_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_gallery_items_parent_id_idx\` ON \`_products_v_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_gallery_items_image_idx\` ON \`_products_v_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_gallery_order_idx\` ON \`_products_v_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_gallery_parent_id_idx\` ON \`_products_v_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_gallery_path_idx\` ON \`_products_v_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_video_order_idx\` ON \`_products_v_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_video_parent_id_idx\` ON \`_products_v_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_video_path_idx\` ON \`_products_v_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_video_poster_idx\` ON \`_products_v_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_audio_order_idx\` ON \`_products_v_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_audio_parent_id_idx\` ON \`_products_v_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_audio_path_idx\` ON \`_products_v_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_audio_track_idx\` ON \`_products_v_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_chart_order_idx\` ON \`_products_v_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_chart_parent_id_idx\` ON \`_products_v_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_chart_path_idx\` ON \`_products_v_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_chart_image_idx\` ON \`_products_v_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_comic_reader_images_order_idx\` ON \`_products_v_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_comic_reader_images_parent_id_idx\` ON \`_products_v_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_comic_reader_images_image_idx\` ON \`_products_v_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_comic_reader_order_idx\` ON \`_products_v_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_comic_reader_parent_id_idx\` ON \`_products_v_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_comic_reader_path_idx\` ON \`_products_v_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_file_download_order_idx\` ON \`_products_v_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_file_download_parent_id_idx\` ON \`_products_v_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_file_download_path_idx\` ON \`_products_v_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_blocks_file_download_file_idx\` ON \`_products_v_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`_products_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_site_id\` integer,
  	\`version_name\` text,
  	\`version_slug\` text,
  	\`version_kind\` text DEFAULT 'digital-product',
  	\`version_summary\` text,
  	\`version_cover_id\` integer,
  	\`version_price_label\` text,
  	\`version_status_label\` text DEFAULT 'coming-soon',
  	\`version_purchase_url\` text,
  	\`version_download_id\` integer,
  	\`version_featured_rank\` numeric,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_canonical\` text,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_download_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_parent_idx\` ON \`_products_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_site_idx\` ON \`_products_v\` (\`version_site_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_slug_idx\` ON \`_products_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_cover_idx\` ON \`_products_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_download_idx\` ON \`_products_v\` (\`version_download_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_seo_version_seo_image_idx\` ON \`_products_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_updated_at_idx\` ON \`_products_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version_created_at_idx\` ON \`_products_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_version_version__status_idx\` ON \`_products_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_created_at_idx\` ON \`_products_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_updated_at_idx\` ON \`_products_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_latest_idx\` ON \`_products_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_autosave_idx\` ON \`_products_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_products_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_products_v_rels_order_idx\` ON \`_products_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_rels_parent_idx\` ON \`_products_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_rels_path_idx\` ON \`_products_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_products_v_rels_terms_id_idx\` ON \`_products_v_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`tracks_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tracks_blocks_rich_text_order_idx\` ON \`tracks_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_rich_text_parent_id_idx\` ON \`tracks_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_rich_text_path_idx\` ON \`tracks_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`tracks_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tracks_blocks_image_order_idx\` ON \`tracks_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_image_parent_id_idx\` ON \`tracks_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_image_path_idx\` ON \`tracks_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_image_image_idx\` ON \`tracks_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`tracks_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tracks_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tracks_blocks_gallery_items_order_idx\` ON \`tracks_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_gallery_items_parent_id_idx\` ON \`tracks_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_gallery_items_image_idx\` ON \`tracks_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`tracks_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tracks_blocks_gallery_order_idx\` ON \`tracks_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_gallery_parent_id_idx\` ON \`tracks_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_gallery_path_idx\` ON \`tracks_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`tracks_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tracks_blocks_video_order_idx\` ON \`tracks_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_video_parent_id_idx\` ON \`tracks_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_video_path_idx\` ON \`tracks_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_video_poster_idx\` ON \`tracks_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`tracks_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tracks_blocks_audio_order_idx\` ON \`tracks_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_audio_parent_id_idx\` ON \`tracks_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_audio_path_idx\` ON \`tracks_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_audio_track_idx\` ON \`tracks_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`tracks_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tracks_blocks_chart_order_idx\` ON \`tracks_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_chart_parent_id_idx\` ON \`tracks_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_chart_path_idx\` ON \`tracks_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_chart_image_idx\` ON \`tracks_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`tracks_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tracks_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tracks_blocks_comic_reader_images_order_idx\` ON \`tracks_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_comic_reader_images_parent_id_idx\` ON \`tracks_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_comic_reader_images_image_idx\` ON \`tracks_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`tracks_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tracks_blocks_comic_reader_order_idx\` ON \`tracks_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_comic_reader_parent_id_idx\` ON \`tracks_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_comic_reader_path_idx\` ON \`tracks_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`tracks_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tracks_blocks_file_download_order_idx\` ON \`tracks_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_file_download_parent_id_idx\` ON \`tracks_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_file_download_path_idx\` ON \`tracks_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`tracks_blocks_file_download_file_idx\` ON \`tracks_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`tracks_streaming_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tracks_streaming_links_order_idx\` ON \`tracks_streaming_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tracks_streaming_links_parent_id_idx\` ON \`tracks_streaming_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tracks\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`artist\` text,
  	\`album\` text,
  	\`release_date\` text,
  	\`cover_id\` integer,
  	\`audio_id\` integer,
  	\`lyrics\` text,
  	\`credits\` text,
  	\`license\` text,
  	\`featured_rank\` numeric,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_canonical\` text,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`audio_id\`) REFERENCES \`audio_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`tracks_site_idx\` ON \`tracks\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`tracks_slug_idx\` ON \`tracks\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`tracks_cover_idx\` ON \`tracks\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`tracks_audio_idx\` ON \`tracks\` (\`audio_id\`);`)
  await db.run(sql`CREATE INDEX \`tracks_seo_seo_image_idx\` ON \`tracks\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`tracks_updated_at_idx\` ON \`tracks\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`tracks_created_at_idx\` ON \`tracks\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`tracks__status_idx\` ON \`tracks\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`tracks_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tracks_rels_order_idx\` ON \`tracks_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`tracks_rels_parent_idx\` ON \`tracks_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tracks_rels_path_idx\` ON \`tracks_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`tracks_rels_terms_id_idx\` ON \`tracks_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`_tracks_v_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tracks_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_rich_text_order_idx\` ON \`_tracks_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_rich_text_parent_id_idx\` ON \`_tracks_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_rich_text_path_idx\` ON \`_tracks_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_tracks_v_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tracks_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_image_order_idx\` ON \`_tracks_v_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_image_parent_id_idx\` ON \`_tracks_v_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_image_path_idx\` ON \`_tracks_v_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_image_image_idx\` ON \`_tracks_v_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_tracks_v_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tracks_v_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_gallery_items_order_idx\` ON \`_tracks_v_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_gallery_items_parent_id_idx\` ON \`_tracks_v_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_gallery_items_image_idx\` ON \`_tracks_v_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_tracks_v_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tracks_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_gallery_order_idx\` ON \`_tracks_v_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_gallery_parent_id_idx\` ON \`_tracks_v_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_gallery_path_idx\` ON \`_tracks_v_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_tracks_v_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tracks_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_video_order_idx\` ON \`_tracks_v_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_video_parent_id_idx\` ON \`_tracks_v_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_video_path_idx\` ON \`_tracks_v_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_video_poster_idx\` ON \`_tracks_v_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`_tracks_v_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tracks_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_audio_order_idx\` ON \`_tracks_v_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_audio_parent_id_idx\` ON \`_tracks_v_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_audio_path_idx\` ON \`_tracks_v_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_audio_track_idx\` ON \`_tracks_v_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`_tracks_v_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tracks_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_chart_order_idx\` ON \`_tracks_v_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_chart_parent_id_idx\` ON \`_tracks_v_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_chart_path_idx\` ON \`_tracks_v_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_chart_image_idx\` ON \`_tracks_v_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_tracks_v_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tracks_v_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_comic_reader_images_order_idx\` ON \`_tracks_v_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_comic_reader_images_parent_id_idx\` ON \`_tracks_v_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_comic_reader_images_image_idx\` ON \`_tracks_v_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_tracks_v_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tracks_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_comic_reader_order_idx\` ON \`_tracks_v_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_comic_reader_parent_id_idx\` ON \`_tracks_v_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_comic_reader_path_idx\` ON \`_tracks_v_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_tracks_v_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tracks_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_file_download_order_idx\` ON \`_tracks_v_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_file_download_parent_id_idx\` ON \`_tracks_v_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_file_download_path_idx\` ON \`_tracks_v_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_blocks_file_download_file_idx\` ON \`_tracks_v_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`_tracks_v_version_streaming_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_tracks_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tracks_v_version_streaming_links_order_idx\` ON \`_tracks_v_version_streaming_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_version_streaming_links_parent_id_idx\` ON \`_tracks_v_version_streaming_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_tracks_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_site_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_artist\` text,
  	\`version_album\` text,
  	\`version_release_date\` text,
  	\`version_cover_id\` integer,
  	\`version_audio_id\` integer,
  	\`version_lyrics\` text,
  	\`version_credits\` text,
  	\`version_license\` text,
  	\`version_featured_rank\` numeric,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_canonical\` text,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_audio_id\`) REFERENCES \`audio_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_tracks_v_parent_idx\` ON \`_tracks_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_version_version_site_idx\` ON \`_tracks_v\` (\`version_site_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_version_version_slug_idx\` ON \`_tracks_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_version_version_cover_idx\` ON \`_tracks_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_version_version_audio_idx\` ON \`_tracks_v\` (\`version_audio_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_version_seo_version_seo_image_idx\` ON \`_tracks_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_version_version_updated_at_idx\` ON \`_tracks_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_version_version_created_at_idx\` ON \`_tracks_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_version_version__status_idx\` ON \`_tracks_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_created_at_idx\` ON \`_tracks_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_updated_at_idx\` ON \`_tracks_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_latest_idx\` ON \`_tracks_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_autosave_idx\` ON \`_tracks_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_tracks_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_tracks_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_tracks_v_rels_order_idx\` ON \`_tracks_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_rels_parent_idx\` ON \`_tracks_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_rels_path_idx\` ON \`_tracks_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_tracks_v_rels_terms_id_idx\` ON \`_tracks_v_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`videos_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`videos_blocks_rich_text_order_idx\` ON \`videos_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_rich_text_parent_id_idx\` ON \`videos_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_rich_text_path_idx\` ON \`videos_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`videos_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`videos_blocks_image_order_idx\` ON \`videos_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_image_parent_id_idx\` ON \`videos_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_image_path_idx\` ON \`videos_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_image_image_idx\` ON \`videos_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`videos_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`videos_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`videos_blocks_gallery_items_order_idx\` ON \`videos_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_gallery_items_parent_id_idx\` ON \`videos_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_gallery_items_image_idx\` ON \`videos_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`videos_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`videos_blocks_gallery_order_idx\` ON \`videos_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_gallery_parent_id_idx\` ON \`videos_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_gallery_path_idx\` ON \`videos_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`videos_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`videos_blocks_video_order_idx\` ON \`videos_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_video_parent_id_idx\` ON \`videos_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_video_path_idx\` ON \`videos_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_video_poster_idx\` ON \`videos_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`videos_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`videos_blocks_audio_order_idx\` ON \`videos_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_audio_parent_id_idx\` ON \`videos_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_audio_path_idx\` ON \`videos_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_audio_track_idx\` ON \`videos_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`videos_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`videos_blocks_chart_order_idx\` ON \`videos_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_chart_parent_id_idx\` ON \`videos_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_chart_path_idx\` ON \`videos_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_chart_image_idx\` ON \`videos_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`videos_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`videos_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`videos_blocks_comic_reader_images_order_idx\` ON \`videos_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_comic_reader_images_parent_id_idx\` ON \`videos_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_comic_reader_images_image_idx\` ON \`videos_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`videos_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`videos_blocks_comic_reader_order_idx\` ON \`videos_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_comic_reader_parent_id_idx\` ON \`videos_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_comic_reader_path_idx\` ON \`videos_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`videos_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`videos_blocks_file_download_order_idx\` ON \`videos_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_file_download_parent_id_idx\` ON \`videos_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_file_download_path_idx\` ON \`videos_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`videos_blocks_file_download_file_idx\` ON \`videos_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`videos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`cover_id\` integer,
  	\`video_url\` text,
  	\`video_file_id\` integer,
  	\`duration\` numeric,
  	\`description\` text,
  	\`published_date\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_canonical\` text,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_file_id\`) REFERENCES \`video_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`videos_site_idx\` ON \`videos\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_slug_idx\` ON \`videos\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`videos_cover_idx\` ON \`videos\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_video_file_idx\` ON \`videos\` (\`video_file_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_seo_seo_image_idx\` ON \`videos\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_updated_at_idx\` ON \`videos\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`videos_created_at_idx\` ON \`videos\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`videos__status_idx\` ON \`videos\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`videos_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`videos_rels_order_idx\` ON \`videos_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`videos_rels_parent_idx\` ON \`videos_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`videos_rels_path_idx\` ON \`videos_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`videos_rels_terms_id_idx\` ON \`videos_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`_videos_v_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_videos_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_rich_text_order_idx\` ON \`_videos_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_rich_text_parent_id_idx\` ON \`_videos_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_rich_text_path_idx\` ON \`_videos_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_videos_v_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_videos_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_image_order_idx\` ON \`_videos_v_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_image_parent_id_idx\` ON \`_videos_v_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_image_path_idx\` ON \`_videos_v_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_image_image_idx\` ON \`_videos_v_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_videos_v_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_videos_v_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_gallery_items_order_idx\` ON \`_videos_v_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_gallery_items_parent_id_idx\` ON \`_videos_v_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_gallery_items_image_idx\` ON \`_videos_v_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_videos_v_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_videos_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_gallery_order_idx\` ON \`_videos_v_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_gallery_parent_id_idx\` ON \`_videos_v_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_gallery_path_idx\` ON \`_videos_v_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_videos_v_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_videos_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_video_order_idx\` ON \`_videos_v_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_video_parent_id_idx\` ON \`_videos_v_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_video_path_idx\` ON \`_videos_v_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_video_poster_idx\` ON \`_videos_v_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`_videos_v_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_videos_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_audio_order_idx\` ON \`_videos_v_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_audio_parent_id_idx\` ON \`_videos_v_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_audio_path_idx\` ON \`_videos_v_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_audio_track_idx\` ON \`_videos_v_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`_videos_v_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_videos_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_chart_order_idx\` ON \`_videos_v_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_chart_parent_id_idx\` ON \`_videos_v_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_chart_path_idx\` ON \`_videos_v_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_chart_image_idx\` ON \`_videos_v_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_videos_v_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_videos_v_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_comic_reader_images_order_idx\` ON \`_videos_v_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_comic_reader_images_parent_id_idx\` ON \`_videos_v_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_comic_reader_images_image_idx\` ON \`_videos_v_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_videos_v_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_videos_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_comic_reader_order_idx\` ON \`_videos_v_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_comic_reader_parent_id_idx\` ON \`_videos_v_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_comic_reader_path_idx\` ON \`_videos_v_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_videos_v_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_videos_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_file_download_order_idx\` ON \`_videos_v_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_file_download_parent_id_idx\` ON \`_videos_v_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_file_download_path_idx\` ON \`_videos_v_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_blocks_file_download_file_idx\` ON \`_videos_v_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`_videos_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_site_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_cover_id\` integer,
  	\`version_video_url\` text,
  	\`version_video_file_id\` integer,
  	\`version_duration\` numeric,
  	\`version_description\` text,
  	\`version_published_date\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_canonical\` text,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_video_file_id\`) REFERENCES \`video_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_videos_v_parent_idx\` ON \`_videos_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_version_version_site_idx\` ON \`_videos_v\` (\`version_site_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_version_version_slug_idx\` ON \`_videos_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_version_version_cover_idx\` ON \`_videos_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_version_version_video_file_idx\` ON \`_videos_v\` (\`version_video_file_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_version_seo_version_seo_image_idx\` ON \`_videos_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_version_version_updated_at_idx\` ON \`_videos_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_version_version_created_at_idx\` ON \`_videos_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_version_version__status_idx\` ON \`_videos_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_created_at_idx\` ON \`_videos_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_updated_at_idx\` ON \`_videos_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_latest_idx\` ON \`_videos_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_autosave_idx\` ON \`_videos_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_videos_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_videos_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_videos_v_rels_order_idx\` ON \`_videos_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_rels_parent_idx\` ON \`_videos_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_rels_path_idx\` ON \`_videos_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_videos_v_rels_terms_id_idx\` ON \`_videos_v_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`learning_paths_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`learning_paths\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`learning_paths_steps_order_idx\` ON \`learning_paths_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`learning_paths_steps_parent_id_idx\` ON \`learning_paths_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`learning_paths\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`description\` text,
  	\`position\` numeric DEFAULT 10,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_canonical\` text,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`learning_paths_site_idx\` ON \`learning_paths\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`learning_paths_slug_idx\` ON \`learning_paths\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`learning_paths_seo_seo_image_idx\` ON \`learning_paths\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`learning_paths_updated_at_idx\` ON \`learning_paths\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`learning_paths_created_at_idx\` ON \`learning_paths\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`learning_paths__status_idx\` ON \`learning_paths\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`learning_paths_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`learning_paths\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`learning_paths_rels_order_idx\` ON \`learning_paths_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`learning_paths_rels_parent_idx\` ON \`learning_paths_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`learning_paths_rels_path_idx\` ON \`learning_paths_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`learning_paths_rels_terms_id_idx\` ON \`learning_paths_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`_learning_paths_v_version_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_learning_paths_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_version_steps_order_idx\` ON \`_learning_paths_v_version_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_version_steps_parent_id_idx\` ON \`_learning_paths_v_version_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_learning_paths_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_site_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_description\` text,
  	\`version_position\` numeric DEFAULT 10,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_canonical\` text,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`learning_paths\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_parent_idx\` ON \`_learning_paths_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_version_version_site_idx\` ON \`_learning_paths_v\` (\`version_site_id\`);`)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_version_version_slug_idx\` ON \`_learning_paths_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_version_seo_version_seo_image_idx\` ON \`_learning_paths_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_version_version_updated_at_idx\` ON \`_learning_paths_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_version_version_created_at_idx\` ON \`_learning_paths_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_version_version__status_idx\` ON \`_learning_paths_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_created_at_idx\` ON \`_learning_paths_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_updated_at_idx\` ON \`_learning_paths_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_latest_idx\` ON \`_learning_paths_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_autosave_idx\` ON \`_learning_paths_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_learning_paths_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_learning_paths_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_rels_order_idx\` ON \`_learning_paths_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_rels_parent_idx\` ON \`_learning_paths_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_rels_path_idx\` ON \`_learning_paths_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_learning_paths_v_rels_terms_id_idx\` ON \`_learning_paths_v_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`skills\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_id\` integer,
  	\`name\` text,
  	\`slug\` text,
  	\`group\` text,
  	\`description\` text,
  	\`level\` text DEFAULT '入门',
  	\`position\` numeric DEFAULT 10,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`skills_site_idx\` ON \`skills\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`skills_slug_idx\` ON \`skills\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`skills_updated_at_idx\` ON \`skills\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`skills_created_at_idx\` ON \`skills\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`skills__status_idx\` ON \`skills\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`skills_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`skills\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`skills_rels_order_idx\` ON \`skills_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`skills_rels_parent_idx\` ON \`skills_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`skills_rels_path_idx\` ON \`skills_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`skills_rels_terms_id_idx\` ON \`skills_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`_skills_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_site_id\` integer,
  	\`version_name\` text,
  	\`version_slug\` text,
  	\`version_group\` text,
  	\`version_description\` text,
  	\`version_level\` text DEFAULT '入门',
  	\`version_position\` numeric DEFAULT 10,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`skills\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_skills_v_parent_idx\` ON \`_skills_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_skills_v_version_version_site_idx\` ON \`_skills_v\` (\`version_site_id\`);`)
  await db.run(sql`CREATE INDEX \`_skills_v_version_version_slug_idx\` ON \`_skills_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_skills_v_version_version_updated_at_idx\` ON \`_skills_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_skills_v_version_version_created_at_idx\` ON \`_skills_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_skills_v_version_version__status_idx\` ON \`_skills_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_skills_v_created_at_idx\` ON \`_skills_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_skills_v_updated_at_idx\` ON \`_skills_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_skills_v_latest_idx\` ON \`_skills_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_skills_v_autosave_idx\` ON \`_skills_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_skills_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_skills_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_skills_v_rels_order_idx\` ON \`_skills_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_skills_v_rels_parent_idx\` ON \`_skills_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_skills_v_rels_path_idx\` ON \`_skills_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_skills_v_rels_terms_id_idx\` ON \`_skills_v_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`comic_series\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`synopsis\` text,
  	\`cover_id\` integer,
  	\`status\` text DEFAULT 'ongoing',
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_canonical\` text,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`comic_series_site_idx\` ON \`comic_series\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_series_slug_idx\` ON \`comic_series\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`comic_series_cover_idx\` ON \`comic_series\` (\`cover_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_series_seo_seo_image_idx\` ON \`comic_series\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_series_updated_at_idx\` ON \`comic_series\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`comic_series_created_at_idx\` ON \`comic_series\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`comic_series__status_idx\` ON \`comic_series\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`comic_series_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`comic_series\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`comic_series_rels_order_idx\` ON \`comic_series_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`comic_series_rels_parent_idx\` ON \`comic_series_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_series_rels_path_idx\` ON \`comic_series_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`comic_series_rels_terms_id_idx\` ON \`comic_series_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`_comic_series_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_site_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_synopsis\` text,
  	\`version_cover_id\` integer,
  	\`version_status\` text DEFAULT 'ongoing',
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_canonical\` text,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`comic_series\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_comic_series_v_parent_idx\` ON \`_comic_series_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_series_v_version_version_site_idx\` ON \`_comic_series_v\` (\`version_site_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_series_v_version_version_slug_idx\` ON \`_comic_series_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_comic_series_v_version_version_cover_idx\` ON \`_comic_series_v\` (\`version_cover_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_series_v_version_seo_version_seo_image_idx\` ON \`_comic_series_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_series_v_version_version_updated_at_idx\` ON \`_comic_series_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_comic_series_v_version_version_created_at_idx\` ON \`_comic_series_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_comic_series_v_version_version__status_idx\` ON \`_comic_series_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_comic_series_v_created_at_idx\` ON \`_comic_series_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_comic_series_v_updated_at_idx\` ON \`_comic_series_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_comic_series_v_latest_idx\` ON \`_comic_series_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_comic_series_v_autosave_idx\` ON \`_comic_series_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`_comic_series_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`terms_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_comic_series_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_comic_series_v_rels_order_idx\` ON \`_comic_series_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_comic_series_v_rels_parent_idx\` ON \`_comic_series_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_series_v_rels_path_idx\` ON \`_comic_series_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_comic_series_v_rels_terms_id_idx\` ON \`_comic_series_v_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE TABLE \`comic_chapters_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`comic_chapters\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_rich_text_order_idx\` ON \`comic_chapters_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_rich_text_parent_id_idx\` ON \`comic_chapters_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_rich_text_path_idx\` ON \`comic_chapters_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`comic_chapters_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`comic_chapters\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_image_order_idx\` ON \`comic_chapters_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_image_parent_id_idx\` ON \`comic_chapters_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_image_path_idx\` ON \`comic_chapters_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_image_image_idx\` ON \`comic_chapters_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`comic_chapters_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`comic_chapters_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_gallery_items_order_idx\` ON \`comic_chapters_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_gallery_items_parent_id_idx\` ON \`comic_chapters_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_gallery_items_image_idx\` ON \`comic_chapters_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`comic_chapters_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`comic_chapters\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_gallery_order_idx\` ON \`comic_chapters_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_gallery_parent_id_idx\` ON \`comic_chapters_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_gallery_path_idx\` ON \`comic_chapters_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`comic_chapters_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`comic_chapters\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_video_order_idx\` ON \`comic_chapters_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_video_parent_id_idx\` ON \`comic_chapters_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_video_path_idx\` ON \`comic_chapters_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_video_poster_idx\` ON \`comic_chapters_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`comic_chapters_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`comic_chapters\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_audio_order_idx\` ON \`comic_chapters_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_audio_parent_id_idx\` ON \`comic_chapters_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_audio_path_idx\` ON \`comic_chapters_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_audio_track_idx\` ON \`comic_chapters_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`comic_chapters_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`comic_chapters\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_chart_order_idx\` ON \`comic_chapters_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_chart_parent_id_idx\` ON \`comic_chapters_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_chart_path_idx\` ON \`comic_chapters_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_chart_image_idx\` ON \`comic_chapters_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`comic_chapters_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`comic_chapters_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_comic_reader_images_order_idx\` ON \`comic_chapters_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_comic_reader_images_parent_id_idx\` ON \`comic_chapters_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_comic_reader_images_image_idx\` ON \`comic_chapters_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`comic_chapters_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`comic_chapters\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_comic_reader_order_idx\` ON \`comic_chapters_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_comic_reader_parent_id_idx\` ON \`comic_chapters_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_comic_reader_path_idx\` ON \`comic_chapters_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`comic_chapters_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`comic_chapters\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_file_download_order_idx\` ON \`comic_chapters_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_file_download_parent_id_idx\` ON \`comic_chapters_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_file_download_path_idx\` ON \`comic_chapters_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_blocks_file_download_file_idx\` ON \`comic_chapters_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`comic_chapters\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_id\` integer,
  	\`series_id\` integer,
  	\`title\` text,
  	\`slug\` text,
  	\`chapter_number\` numeric,
  	\`published_date\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_canonical\` text,
  	\`seo_noindex\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`series_id\`) REFERENCES \`comic_series\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`comic_chapters_site_idx\` ON \`comic_chapters\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_series_idx\` ON \`comic_chapters\` (\`series_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_slug_idx\` ON \`comic_chapters\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_seo_seo_image_idx\` ON \`comic_chapters\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_updated_at_idx\` ON \`comic_chapters\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters_created_at_idx\` ON \`comic_chapters\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`comic_chapters__status_idx\` ON \`comic_chapters\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_comic_chapters_v_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_comic_chapters_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_rich_text_order_idx\` ON \`_comic_chapters_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_rich_text_parent_id_idx\` ON \`_comic_chapters_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_rich_text_path_idx\` ON \`_comic_chapters_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_comic_chapters_v_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_comic_chapters_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_image_order_idx\` ON \`_comic_chapters_v_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_image_parent_id_idx\` ON \`_comic_chapters_v_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_image_path_idx\` ON \`_comic_chapters_v_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_image_image_idx\` ON \`_comic_chapters_v_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_comic_chapters_v_blocks_gallery_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_comic_chapters_v_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_gallery_items_order_idx\` ON \`_comic_chapters_v_blocks_gallery_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_gallery_items_parent_id_idx\` ON \`_comic_chapters_v_blocks_gallery_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_gallery_items_image_idx\` ON \`_comic_chapters_v_blocks_gallery_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_comic_chapters_v_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_comic_chapters_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_gallery_order_idx\` ON \`_comic_chapters_v_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_gallery_parent_id_idx\` ON \`_comic_chapters_v_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_gallery_path_idx\` ON \`_comic_chapters_v_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_comic_chapters_v_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`provider\` text DEFAULT 'bilibili',
  	\`url\` text,
  	\`poster_id\` integer,
  	\`title\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_comic_chapters_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_video_order_idx\` ON \`_comic_chapters_v_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_video_parent_id_idx\` ON \`_comic_chapters_v_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_video_path_idx\` ON \`_comic_chapters_v_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_video_poster_idx\` ON \`_comic_chapters_v_blocks_video\` (\`poster_id\`);`)
  await db.run(sql`CREATE TABLE \`_comic_chapters_v_blocks_audio\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`track_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`track_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_comic_chapters_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_audio_order_idx\` ON \`_comic_chapters_v_blocks_audio\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_audio_parent_id_idx\` ON \`_comic_chapters_v_blocks_audio\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_audio_path_idx\` ON \`_comic_chapters_v_blocks_audio\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_audio_track_idx\` ON \`_comic_chapters_v_blocks_audio\` (\`track_id\`);`)
  await db.run(sql`CREATE TABLE \`_comic_chapters_v_blocks_chart\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`image_id\` integer,
  	\`data_table\` text,
  	\`source\` text,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_comic_chapters_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_chart_order_idx\` ON \`_comic_chapters_v_blocks_chart\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_chart_parent_id_idx\` ON \`_comic_chapters_v_blocks_chart\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_chart_path_idx\` ON \`_comic_chapters_v_blocks_chart\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_chart_image_idx\` ON \`_comic_chapters_v_blocks_chart\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_comic_chapters_v_blocks_comic_reader_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`alt\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_comic_chapters_v_blocks_comic_reader\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_comic_reader_images_order_idx\` ON \`_comic_chapters_v_blocks_comic_reader_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_comic_reader_images_parent_id_idx\` ON \`_comic_chapters_v_blocks_comic_reader_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_comic_reader_images_image_idx\` ON \`_comic_chapters_v_blocks_comic_reader_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_comic_chapters_v_blocks_comic_reader\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`reading_mode\` text DEFAULT 'vertical',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_comic_chapters_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_comic_reader_order_idx\` ON \`_comic_chapters_v_blocks_comic_reader\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_comic_reader_parent_id_idx\` ON \`_comic_chapters_v_blocks_comic_reader\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_comic_reader_path_idx\` ON \`_comic_chapters_v_blocks_comic_reader\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_comic_chapters_v_blocks_file_download\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`file_id\` integer,
  	\`title\` text,
  	\`description\` text,
  	\`button_label\` text DEFAULT '下载文件',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_comic_chapters_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_file_download_order_idx\` ON \`_comic_chapters_v_blocks_file_download\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_file_download_parent_id_idx\` ON \`_comic_chapters_v_blocks_file_download\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_file_download_path_idx\` ON \`_comic_chapters_v_blocks_file_download\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_blocks_file_download_file_idx\` ON \`_comic_chapters_v_blocks_file_download\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`_comic_chapters_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_site_id\` integer,
  	\`version_series_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_chapter_number\` numeric,
  	\`version_published_date\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_canonical\` text,
  	\`version_seo_noindex\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`comic_chapters\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_series_id\`) REFERENCES \`comic_series\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_parent_idx\` ON \`_comic_chapters_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_version_version_site_idx\` ON \`_comic_chapters_v\` (\`version_site_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_version_version_series_idx\` ON \`_comic_chapters_v\` (\`version_series_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_version_version_slug_idx\` ON \`_comic_chapters_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_version_seo_version_seo_image_idx\` ON \`_comic_chapters_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_version_version_updated_at_idx\` ON \`_comic_chapters_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_version_version_created_at_idx\` ON \`_comic_chapters_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_version_version__status_idx\` ON \`_comic_chapters_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_created_at_idx\` ON \`_comic_chapters_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_updated_at_idx\` ON \`_comic_chapters_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_latest_idx\` ON \`_comic_chapters_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_comic_chapters_v_autosave_idx\` ON \`_comic_chapters_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`terms\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_id\` integer NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`taxonomy\` text DEFAULT 'category' NOT NULL,
  	\`parent_id\` integer,
  	\`description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`terms_site_idx\` ON \`terms\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`terms_slug_idx\` ON \`terms\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`terms_parent_idx\` ON \`terms\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`terms_updated_at_idx\` ON \`terms\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`terms_created_at_idx\` ON \`terms\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`caption\` text,
  	\`credit\` text,
  	\`site_id\` integer NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumbnail_url\` text,
  	\`sizes_thumbnail_width\` numeric,
  	\`sizes_thumbnail_height\` numeric,
  	\`sizes_thumbnail_mime_type\` text,
  	\`sizes_thumbnail_filesize\` numeric,
  	\`sizes_thumbnail_filename\` text,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_hero_url\` text,
  	\`sizes_hero_width\` numeric,
  	\`sizes_hero_height\` numeric,
  	\`sizes_hero_mime_type\` text,
  	\`sizes_hero_filesize\` numeric,
  	\`sizes_hero_filename\` text,
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`media_site_idx\` ON \`media\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_hero_sizes_hero_filename_idx\` ON \`media\` (\`sizes_hero_filename\`);`)
  await db.run(sql`CREATE TABLE \`audio_assets\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`artist\` text,
  	\`duration_seconds\` numeric,
  	\`license\` text,
  	\`rights_owner\` text,
  	\`site_id\` integer NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`audio_assets_site_idx\` ON \`audio_assets\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`audio_assets_updated_at_idx\` ON \`audio_assets\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`audio_assets_created_at_idx\` ON \`audio_assets\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`audio_assets_filename_idx\` ON \`audio_assets\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`download_assets\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`version\` text DEFAULT '1.0.0',
  	\`checksum\` text,
  	\`site_id\` integer NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`download_assets_site_idx\` ON \`download_assets\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`download_assets_updated_at_idx\` ON \`download_assets\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`download_assets_created_at_idx\` ON \`download_assets\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`download_assets_filename_idx\` ON \`download_assets\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`video_assets\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`duration\` numeric,
  	\`site_id\` integer NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`video_assets_site_idx\` ON \`video_assets\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`video_assets_updated_at_idx\` ON \`video_assets\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`video_assets_created_at_idx\` ON \`video_assets\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`video_assets_filename_idx\` ON \`video_assets\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`sections\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_id\` integer NOT NULL,
  	\`key\` text NOT NULL,
  	\`label\` text NOT NULL,
  	\`kind\` text DEFAULT 'collection' NOT NULL,
  	\`source_collection\` text,
  	\`filter\` text,
  	\`route_path\` text NOT NULL,
  	\`template_key\` text DEFAULT 'list' NOT NULL,
  	\`position\` numeric DEFAULT 10 NOT NULL,
  	\`visible\` integer DEFAULT true,
  	\`show_on_home\` integer DEFAULT true,
  	\`show_in_nav\` integer DEFAULT true,
  	\`external_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`sections_site_idx\` ON \`sections\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`sections_updated_at_idx\` ON \`sections\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`sections_created_at_idx\` ON \`sections\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`sites_domains\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`host\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`sites_domains_order_idx\` ON \`sites_domains\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`sites_domains_parent_id_idx\` ON \`sites_domains\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`sites_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`sites_social_links_order_idx\` ON \`sites_social_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`sites_social_links_parent_id_idx\` ON \`sites_social_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`sites\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`is_default\` integer DEFAULT false,
  	\`public_url\` text,
  	\`brand_tagline\` text,
  	\`brand_description\` text,
  	\`brand_logo_id\` integer,
  	\`brand_primary_color\` text DEFAULT '#1f7a5a',
  	\`brand_footer_text\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`storage_quota_mb\` numeric DEFAULT 1024,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`brand_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`sites_slug_idx\` ON \`sites\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`sites_brand_brand_logo_idx\` ON \`sites\` (\`brand_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`sites_seo_seo_image_idx\` ON \`sites\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`sites_updated_at_idx\` ON \`sites\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`sites_created_at_idx\` ON \`sites\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`memberships\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`user_id\` integer NOT NULL,
  	\`site_id\` integer NOT NULL,
  	\`role\` text DEFAULT 'editor' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`memberships_user_idx\` ON \`memberships\` (\`user_id\`);`)
  await db.run(sql`CREATE INDEX \`memberships_site_idx\` ON \`memberships\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`memberships_updated_at_idx\` ON \`memberships\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`memberships_created_at_idx\` ON \`memberships\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`platform_role\` text DEFAULT 'user' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`leads\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`message\` text NOT NULL,
  	\`source\` text DEFAULT 'contact',
  	\`status\` text DEFAULT 'new',
  	\`note\` text,
  	\`site_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`site_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`leads_site_idx\` ON \`leads\` (\`site_id\`);`)
  await db.run(sql`CREATE INDEX \`leads_updated_at_idx\` ON \`leads\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`leads_created_at_idx\` ON \`leads\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	\`articles_id\` integer,
  	\`tutorials_id\` integer,
  	\`tools_id\` integer,
  	\`products_id\` integer,
  	\`tracks_id\` integer,
  	\`videos_id\` integer,
  	\`learning_paths_id\` integer,
  	\`skills_id\` integer,
  	\`comic_series_id\` integer,
  	\`comic_chapters_id\` integer,
  	\`terms_id\` integer,
  	\`media_id\` integer,
  	\`audio_assets_id\` integer,
  	\`download_assets_id\` integer,
  	\`video_assets_id\` integer,
  	\`sections_id\` integer,
  	\`sites_id\` integer,
  	\`memberships_id\` integer,
  	\`users_id\` integer,
  	\`leads_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tutorials_id\`) REFERENCES \`tutorials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tools_id\`) REFERENCES \`tools\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tracks_id\`) REFERENCES \`tracks\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`videos_id\`) REFERENCES \`videos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`learning_paths_id\`) REFERENCES \`learning_paths\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`skills_id\`) REFERENCES \`skills\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`comic_series_id\`) REFERENCES \`comic_series\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`comic_chapters_id\`) REFERENCES \`comic_chapters\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`terms_id\`) REFERENCES \`terms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`audio_assets_id\`) REFERENCES \`audio_assets\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`download_assets_id\`) REFERENCES \`download_assets\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`video_assets_id\`) REFERENCES \`video_assets\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`sections_id\`) REFERENCES \`sections\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`sites_id\`) REFERENCES \`sites\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`memberships_id\`) REFERENCES \`memberships\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`leads_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_tutorials_id_idx\` ON \`payload_locked_documents_rels\` (\`tutorials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_tools_id_idx\` ON \`payload_locked_documents_rels\` (\`tools_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_tracks_id_idx\` ON \`payload_locked_documents_rels\` (\`tracks_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_videos_id_idx\` ON \`payload_locked_documents_rels\` (\`videos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_learning_paths_id_idx\` ON \`payload_locked_documents_rels\` (\`learning_paths_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_skills_id_idx\` ON \`payload_locked_documents_rels\` (\`skills_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_comic_series_id_idx\` ON \`payload_locked_documents_rels\` (\`comic_series_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_comic_chapters_id_idx\` ON \`payload_locked_documents_rels\` (\`comic_chapters_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_terms_id_idx\` ON \`payload_locked_documents_rels\` (\`terms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_audio_assets_id_idx\` ON \`payload_locked_documents_rels\` (\`audio_assets_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_download_assets_id_idx\` ON \`payload_locked_documents_rels\` (\`download_assets_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_video_assets_id_idx\` ON \`payload_locked_documents_rels\` (\`video_assets_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_sections_id_idx\` ON \`payload_locked_documents_rels\` (\`sections_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_sites_id_idx\` ON \`payload_locked_documents_rels\` (\`sites_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_memberships_id_idx\` ON \`payload_locked_documents_rels\` (\`memberships_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_leads_id_idx\` ON \`payload_locked_documents_rels\` (\`leads_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`articles_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`articles\`;`)
  await db.run(sql`DROP TABLE \`articles_rels\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`_articles_v\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_rels\`;`)
  await db.run(sql`DROP TABLE \`tutorials_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`tutorials_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`tutorials_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`tutorials_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`tutorials_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`tutorials_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`tutorials_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`tutorials_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`tutorials_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`tutorials_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`tutorials\`;`)
  await db.run(sql`DROP TABLE \`tutorials_rels\`;`)
  await db.run(sql`DROP TABLE \`_tutorials_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_tutorials_v_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`_tutorials_v_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`_tutorials_v_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`_tutorials_v_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`_tutorials_v_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`_tutorials_v_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`_tutorials_v_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`_tutorials_v_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`_tutorials_v_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`_tutorials_v\`;`)
  await db.run(sql`DROP TABLE \`_tutorials_v_rels\`;`)
  await db.run(sql`DROP TABLE \`tools_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`tools_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`tools_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`tools_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`tools_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`tools_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`tools_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`tools_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`tools_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`tools_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`tools_platforms\`;`)
  await db.run(sql`DROP TABLE \`tools\`;`)
  await db.run(sql`DROP TABLE \`tools_rels\`;`)
  await db.run(sql`DROP TABLE \`_tools_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_tools_v_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`_tools_v_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`_tools_v_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`_tools_v_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`_tools_v_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`_tools_v_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`_tools_v_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`_tools_v_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`_tools_v_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`_tools_v_version_platforms\`;`)
  await db.run(sql`DROP TABLE \`_tools_v\`;`)
  await db.run(sql`DROP TABLE \`_tools_v_rels\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`products_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`products\`;`)
  await db.run(sql`DROP TABLE \`products_rels\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`_products_v_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`_products_v\`;`)
  await db.run(sql`DROP TABLE \`_products_v_rels\`;`)
  await db.run(sql`DROP TABLE \`tracks_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`tracks_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`tracks_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`tracks_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`tracks_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`tracks_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`tracks_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`tracks_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`tracks_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`tracks_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`tracks_streaming_links\`;`)
  await db.run(sql`DROP TABLE \`tracks\`;`)
  await db.run(sql`DROP TABLE \`tracks_rels\`;`)
  await db.run(sql`DROP TABLE \`_tracks_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_tracks_v_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`_tracks_v_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`_tracks_v_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`_tracks_v_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`_tracks_v_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`_tracks_v_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`_tracks_v_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`_tracks_v_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`_tracks_v_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`_tracks_v_version_streaming_links\`;`)
  await db.run(sql`DROP TABLE \`_tracks_v\`;`)
  await db.run(sql`DROP TABLE \`_tracks_v_rels\`;`)
  await db.run(sql`DROP TABLE \`videos_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`videos_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`videos_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`videos_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`videos_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`videos_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`videos_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`videos_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`videos_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`videos_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`videos\`;`)
  await db.run(sql`DROP TABLE \`videos_rels\`;`)
  await db.run(sql`DROP TABLE \`_videos_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_videos_v_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`_videos_v_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`_videos_v_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`_videos_v_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`_videos_v_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`_videos_v_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`_videos_v_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`_videos_v_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`_videos_v_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`_videos_v\`;`)
  await db.run(sql`DROP TABLE \`_videos_v_rels\`;`)
  await db.run(sql`DROP TABLE \`learning_paths_steps\`;`)
  await db.run(sql`DROP TABLE \`learning_paths\`;`)
  await db.run(sql`DROP TABLE \`learning_paths_rels\`;`)
  await db.run(sql`DROP TABLE \`_learning_paths_v_version_steps\`;`)
  await db.run(sql`DROP TABLE \`_learning_paths_v\`;`)
  await db.run(sql`DROP TABLE \`_learning_paths_v_rels\`;`)
  await db.run(sql`DROP TABLE \`skills\`;`)
  await db.run(sql`DROP TABLE \`skills_rels\`;`)
  await db.run(sql`DROP TABLE \`_skills_v\`;`)
  await db.run(sql`DROP TABLE \`_skills_v_rels\`;`)
  await db.run(sql`DROP TABLE \`comic_series\`;`)
  await db.run(sql`DROP TABLE \`comic_series_rels\`;`)
  await db.run(sql`DROP TABLE \`_comic_series_v\`;`)
  await db.run(sql`DROP TABLE \`_comic_series_v_rels\`;`)
  await db.run(sql`DROP TABLE \`comic_chapters_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`comic_chapters_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`comic_chapters_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`comic_chapters_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`comic_chapters_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`comic_chapters_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`comic_chapters_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`comic_chapters_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`comic_chapters_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`comic_chapters_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`comic_chapters\`;`)
  await db.run(sql`DROP TABLE \`_comic_chapters_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_comic_chapters_v_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`_comic_chapters_v_blocks_gallery_items\`;`)
  await db.run(sql`DROP TABLE \`_comic_chapters_v_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`_comic_chapters_v_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`_comic_chapters_v_blocks_audio\`;`)
  await db.run(sql`DROP TABLE \`_comic_chapters_v_blocks_chart\`;`)
  await db.run(sql`DROP TABLE \`_comic_chapters_v_blocks_comic_reader_images\`;`)
  await db.run(sql`DROP TABLE \`_comic_chapters_v_blocks_comic_reader\`;`)
  await db.run(sql`DROP TABLE \`_comic_chapters_v_blocks_file_download\`;`)
  await db.run(sql`DROP TABLE \`_comic_chapters_v\`;`)
  await db.run(sql`DROP TABLE \`terms\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`audio_assets\`;`)
  await db.run(sql`DROP TABLE \`download_assets\`;`)
  await db.run(sql`DROP TABLE \`video_assets\`;`)
  await db.run(sql`DROP TABLE \`sections\`;`)
  await db.run(sql`DROP TABLE \`sites_domains\`;`)
  await db.run(sql`DROP TABLE \`sites_social_links\`;`)
  await db.run(sql`DROP TABLE \`sites\`;`)
  await db.run(sql`DROP TABLE \`memberships\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`leads\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
}
