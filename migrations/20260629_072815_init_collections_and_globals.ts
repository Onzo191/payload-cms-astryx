import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('super-admin', 'admin', 'editor', 'author', 'reviewer', 'viewer');
  CREATE TYPE "public"."enum_users_status" AS ENUM('active', 'invited', 'suspended');
  CREATE TYPE "public"."enum_media_visibility" AS ENUM('public', 'authenticated');
  CREATE TYPE "public"."enum_pages_hero_layout" AS ENUM('standard', 'compact', 'immersive');
  CREATE TYPE "public"."enum_pages_seo_robots" AS ENUM('index-follow', 'noindex-follow', 'noindex-nofollow');
  CREATE TYPE "public"."enum_pages_seo_schema_type" AS ENUM('WebPage', 'NewsArticle', 'Report', 'Article');
  CREATE TYPE "public"."enum_pages_workflow_status" AS ENUM('draft', 'review', 'changes_requested', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_hero_layout" AS ENUM('standard', 'compact', 'immersive');
  CREATE TYPE "public"."enum__pages_v_version_seo_robots" AS ENUM('index-follow', 'noindex-follow', 'noindex-nofollow');
  CREATE TYPE "public"."enum__pages_v_version_seo_schema_type" AS ENUM('WebPage', 'NewsArticle', 'Report', 'Article');
  CREATE TYPE "public"."enum__pages_v_version_workflow_status" AS ENUM('draft', 'review', 'changes_requested', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_hero_layout" AS ENUM('standard', 'compact', 'immersive');
  CREATE TYPE "public"."enum_news_seo_robots" AS ENUM('index-follow', 'noindex-follow', 'noindex-nofollow');
  CREATE TYPE "public"."enum_news_seo_schema_type" AS ENUM('WebPage', 'NewsArticle', 'Report', 'Article');
  CREATE TYPE "public"."enum_news_workflow_status" AS ENUM('draft', 'review', 'changes_requested', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_hero_layout" AS ENUM('standard', 'compact', 'immersive');
  CREATE TYPE "public"."enum__news_v_version_seo_robots" AS ENUM('index-follow', 'noindex-follow', 'noindex-nofollow');
  CREATE TYPE "public"."enum__news_v_version_seo_schema_type" AS ENUM('WebPage', 'NewsArticle', 'Report', 'Article');
  CREATE TYPE "public"."enum__news_v_version_workflow_status" AS ENUM('draft', 'review', 'changes_requested', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_reports_period" AS ENUM('annual', 'quarterly', 'monthly', 'custom');
  CREATE TYPE "public"."enum_reports_report_type" AS ENUM('revenue', 'financial', 'impact', 'operations', 'other');
  CREATE TYPE "public"."enum_reports_seo_robots" AS ENUM('index-follow', 'noindex-follow', 'noindex-nofollow');
  CREATE TYPE "public"."enum_reports_seo_schema_type" AS ENUM('WebPage', 'NewsArticle', 'Report', 'Article');
  CREATE TYPE "public"."enum_reports_workflow_status" AS ENUM('draft', 'review', 'changes_requested', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum_reports_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reports_v_version_period" AS ENUM('annual', 'quarterly', 'monthly', 'custom');
  CREATE TYPE "public"."enum__reports_v_version_report_type" AS ENUM('revenue', 'financial', 'impact', 'operations', 'other');
  CREATE TYPE "public"."enum__reports_v_version_seo_robots" AS ENUM('index-follow', 'noindex-follow', 'noindex-nofollow');
  CREATE TYPE "public"."enum__reports_v_version_seo_schema_type" AS ENUM('WebPage', 'NewsArticle', 'Report', 'Article');
  CREATE TYPE "public"."enum__reports_v_version_workflow_status" AS ENUM('draft', 'review', 'changes_requested', 'approved', 'published', 'archived');
  CREATE TYPE "public"."enum__reports_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_audit_logs_action" AS ENUM('create', 'update');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'sitemap', 'searchIndexing', 'reportTextExtraction', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'sitemap', 'searchIndexing', 'reportTextExtraction', 'schedulePublish');
  CREATE TYPE "public"."enum_seo_defaults_seo_robots" AS ENUM('index-follow', 'noindex-follow', 'noindex-nofollow');
  CREATE TYPE "public"."enum_seo_defaults_seo_schema_type" AS ENUM('WebPage', 'NewsArticle', 'Report', 'Article');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum_users_roles",
  	"id" uuid PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Unnamed User' NOT NULL,
  	"status" "enum_users_status" DEFAULT 'active' NOT NULL,
  	"avatar_id" uuid,
  	"bio" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"credit" varchar,
  	"visibility" "enum_media_visibility" DEFAULT 'public' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"parent_id" uuid,
  	"full_path" varchar,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_summary" varchar,
  	"hero_image_id" uuid,
  	"hero_layout" "enum_pages_hero_layout" DEFAULT 'standard',
  	"layout" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical_url" varchar,
  	"seo_robots" "enum_pages_seo_robots" DEFAULT 'index-follow',
  	"seo_open_graph_image_id" uuid,
  	"seo_schema_type" "enum_pages_seo_schema_type" DEFAULT 'WebPage',
  	"workflow_status" "enum_pages_workflow_status" DEFAULT 'draft',
  	"review_notes" varchar,
  	"published_at" timestamp(3) with time zone,
  	"approved_at" timestamp(3) with time zone,
  	"archived_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_parent_id" uuid,
  	"version_full_path" varchar,
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_summary" varchar,
  	"version_hero_image_id" uuid,
  	"version_hero_layout" "enum__pages_v_version_hero_layout" DEFAULT 'standard',
  	"version_layout" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_canonical_url" varchar,
  	"version_seo_robots" "enum__pages_v_version_seo_robots" DEFAULT 'index-follow',
  	"version_seo_open_graph_image_id" uuid,
  	"version_seo_schema_type" "enum__pages_v_version_seo_schema_type" DEFAULT 'WebPage',
  	"version_workflow_status" "enum__pages_v_version_workflow_status" DEFAULT 'draft',
  	"version_review_notes" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_approved_at" timestamp(3) with time zone,
  	"version_archived_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "news" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_summary" varchar,
  	"hero_image_id" uuid,
  	"hero_layout" "enum_news_hero_layout" DEFAULT 'standard',
  	"content" jsonb,
  	"author_id" uuid,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical_url" varchar,
  	"seo_robots" "enum_news_seo_robots" DEFAULT 'index-follow',
  	"seo_open_graph_image_id" uuid,
  	"seo_schema_type" "enum_news_seo_schema_type" DEFAULT 'WebPage',
  	"workflow_status" "enum_news_workflow_status" DEFAULT 'draft',
  	"review_notes" varchar,
  	"published_at" timestamp(3) with time zone,
  	"approved_at" timestamp(3) with time zone,
  	"archived_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "news_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" uuid,
  	"tags_id" uuid
  );
  
  CREATE TABLE "_news_v" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_summary" varchar,
  	"version_hero_image_id" uuid,
  	"version_hero_layout" "enum__news_v_version_hero_layout" DEFAULT 'standard',
  	"version_content" jsonb,
  	"version_author_id" uuid,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_canonical_url" varchar,
  	"version_seo_robots" "enum__news_v_version_seo_robots" DEFAULT 'index-follow',
  	"version_seo_open_graph_image_id" uuid,
  	"version_seo_schema_type" "enum__news_v_version_seo_schema_type" DEFAULT 'WebPage',
  	"version_workflow_status" "enum__news_v_version_workflow_status" DEFAULT 'draft',
  	"version_review_notes" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_approved_at" timestamp(3) with time zone,
  	"version_archived_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_news_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" uuid,
  	"tags_id" uuid
  );
  
  CREATE TABLE "reports_key_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"unit" varchar
  );
  
  CREATE TABLE "reports" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"year" numeric,
  	"period" "enum_reports_period" DEFAULT 'annual',
  	"report_type" "enum_reports_report_type" DEFAULT 'revenue',
  	"file_id" uuid,
  	"summary" varchar,
  	"extracted_text" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical_url" varchar,
  	"seo_robots" "enum_reports_seo_robots" DEFAULT 'index-follow',
  	"seo_open_graph_image_id" uuid,
  	"seo_schema_type" "enum_reports_seo_schema_type" DEFAULT 'WebPage',
  	"workflow_status" "enum_reports_workflow_status" DEFAULT 'draft',
  	"review_notes" varchar,
  	"published_at" timestamp(3) with time zone,
  	"approved_at" timestamp(3) with time zone,
  	"archived_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_reports_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "reports_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" uuid
  );
  
  CREATE TABLE "_reports_v_version_key_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"unit" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reports_v" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_year" numeric,
  	"version_period" "enum__reports_v_version_period" DEFAULT 'annual',
  	"version_report_type" "enum__reports_v_version_report_type" DEFAULT 'revenue',
  	"version_file_id" uuid,
  	"version_summary" varchar,
  	"version_extracted_text" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_canonical_url" varchar,
  	"version_seo_robots" "enum__reports_v_version_seo_robots" DEFAULT 'index-follow',
  	"version_seo_open_graph_image_id" uuid,
  	"version_seo_schema_type" "enum__reports_v_version_seo_schema_type" DEFAULT 'WebPage',
  	"version_workflow_status" "enum__reports_v_version_workflow_status" DEFAULT 'draft',
  	"version_review_notes" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_approved_at" timestamp(3) with time zone,
  	"version_archived_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__reports_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_reports_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" uuid
  );
  
  CREATE TABLE "audit_logs" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"action" "enum_audit_logs_action" NOT NULL,
  	"actor_id" uuid,
  	"collection_slug" varchar NOT NULL,
  	"document_id" varchar NOT NULL,
  	"previous_value" jsonb,
  	"next_value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid,
  	"media_id" uuid,
  	"categories_id" uuid,
  	"tags_id" uuid,
  	"pages_id" uuid,
  	"news_id" uuid,
  	"reports_id" uuid,
  	"audit_logs_id" uuid
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"copyright" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"site_name" varchar NOT NULL,
  	"site_url" varchar NOT NULL,
  	"default_locale" varchar DEFAULT 'en' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo_defaults" (
  	"id" uuid PRIMARY KEY NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical_url" varchar,
  	"seo_robots" "enum_seo_defaults_seo_robots" DEFAULT 'index-follow',
  	"seo_open_graph_image_id" uuid,
  	"seo_schema_type" "enum_seo_defaults_seo_schema_type" DEFAULT 'WebPage',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_key_metrics" ADD CONSTRAINT "reports_key_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports" ADD CONSTRAINT "reports_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reports_rels" ADD CONSTRAINT "reports_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reports_rels" ADD CONSTRAINT "reports_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_version_key_metrics" ADD CONSTRAINT "_reports_v_version_key_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_parent_id_reports_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v" ADD CONSTRAINT "_reports_v_version_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_reports_v_rels" ADD CONSTRAINT "_reports_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_reports_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reports_v_rels" ADD CONSTRAINT "_reports_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reports_fk" FOREIGN KEY ("reports_id") REFERENCES "public"."reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_logs_fk" FOREIGN KEY ("audit_logs_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_links" ADD CONSTRAINT "footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo_defaults" ADD CONSTRAINT "seo_defaults_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX "pages_full_path_idx" ON "pages" USING btree ("full_path");
  CREATE INDEX "pages_hero_hero_image_idx" ON "pages" USING btree ("hero_image_id");
  CREATE INDEX "pages_seo_seo_open_graph_image_idx" ON "pages" USING btree ("seo_open_graph_image_id");
  CREATE INDEX "pages_workflow_status_idx" ON "pages" USING btree ("workflow_status");
  CREATE INDEX "pages_published_at_idx" ON "pages" USING btree ("published_at");
  CREATE INDEX "pages_archived_at_idx" ON "pages" USING btree ("archived_at");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  CREATE INDEX "_pages_v_version_version_full_path_idx" ON "_pages_v" USING btree ("version_full_path");
  CREATE INDEX "_pages_v_version_hero_version_hero_image_idx" ON "_pages_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_pages_v_version_seo_version_seo_open_graph_image_idx" ON "_pages_v" USING btree ("version_seo_open_graph_image_id");
  CREATE INDEX "_pages_v_version_version_workflow_status_idx" ON "_pages_v" USING btree ("version_workflow_status");
  CREATE INDEX "_pages_v_version_version_published_at_idx" ON "_pages_v" USING btree ("version_published_at");
  CREATE INDEX "_pages_v_version_version_archived_at_idx" ON "_pages_v" USING btree ("version_archived_at");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_hero_hero_image_idx" ON "news" USING btree ("hero_image_id");
  CREATE INDEX "news_author_idx" ON "news" USING btree ("author_id");
  CREATE INDEX "news_seo_seo_open_graph_image_idx" ON "news" USING btree ("seo_open_graph_image_id");
  CREATE INDEX "news_workflow_status_idx" ON "news" USING btree ("workflow_status");
  CREATE INDEX "news_published_at_idx" ON "news" USING btree ("published_at");
  CREATE INDEX "news_archived_at_idx" ON "news" USING btree ("archived_at");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "news_rels_order_idx" ON "news_rels" USING btree ("order");
  CREATE INDEX "news_rels_parent_idx" ON "news_rels" USING btree ("parent_id");
  CREATE INDEX "news_rels_path_idx" ON "news_rels" USING btree ("path");
  CREATE INDEX "news_rels_categories_id_idx" ON "news_rels" USING btree ("categories_id");
  CREATE INDEX "news_rels_tags_id_idx" ON "news_rels" USING btree ("tags_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_hero_version_hero_image_idx" ON "_news_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_news_v_version_version_author_idx" ON "_news_v" USING btree ("version_author_id");
  CREATE INDEX "_news_v_version_seo_version_seo_open_graph_image_idx" ON "_news_v" USING btree ("version_seo_open_graph_image_id");
  CREATE INDEX "_news_v_version_version_workflow_status_idx" ON "_news_v" USING btree ("version_workflow_status");
  CREATE INDEX "_news_v_version_version_published_at_idx" ON "_news_v" USING btree ("version_published_at");
  CREATE INDEX "_news_v_version_version_archived_at_idx" ON "_news_v" USING btree ("version_archived_at");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_autosave_idx" ON "_news_v" USING btree ("autosave");
  CREATE INDEX "_news_v_rels_order_idx" ON "_news_v_rels" USING btree ("order");
  CREATE INDEX "_news_v_rels_parent_idx" ON "_news_v_rels" USING btree ("parent_id");
  CREATE INDEX "_news_v_rels_path_idx" ON "_news_v_rels" USING btree ("path");
  CREATE INDEX "_news_v_rels_categories_id_idx" ON "_news_v_rels" USING btree ("categories_id");
  CREATE INDEX "_news_v_rels_tags_id_idx" ON "_news_v_rels" USING btree ("tags_id");
  CREATE INDEX "reports_key_metrics_order_idx" ON "reports_key_metrics" USING btree ("_order");
  CREATE INDEX "reports_key_metrics_parent_id_idx" ON "reports_key_metrics" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "reports_slug_idx" ON "reports" USING btree ("slug");
  CREATE INDEX "reports_year_idx" ON "reports" USING btree ("year");
  CREATE INDEX "reports_file_idx" ON "reports" USING btree ("file_id");
  CREATE INDEX "reports_seo_seo_open_graph_image_idx" ON "reports" USING btree ("seo_open_graph_image_id");
  CREATE INDEX "reports_workflow_status_idx" ON "reports" USING btree ("workflow_status");
  CREATE INDEX "reports_published_at_idx" ON "reports" USING btree ("published_at");
  CREATE INDEX "reports_archived_at_idx" ON "reports" USING btree ("archived_at");
  CREATE INDEX "reports_updated_at_idx" ON "reports" USING btree ("updated_at");
  CREATE INDEX "reports_created_at_idx" ON "reports" USING btree ("created_at");
  CREATE INDEX "reports__status_idx" ON "reports" USING btree ("_status");
  CREATE INDEX "reports_rels_order_idx" ON "reports_rels" USING btree ("order");
  CREATE INDEX "reports_rels_parent_idx" ON "reports_rels" USING btree ("parent_id");
  CREATE INDEX "reports_rels_path_idx" ON "reports_rels" USING btree ("path");
  CREATE INDEX "reports_rels_categories_id_idx" ON "reports_rels" USING btree ("categories_id");
  CREATE INDEX "_reports_v_version_key_metrics_order_idx" ON "_reports_v_version_key_metrics" USING btree ("_order");
  CREATE INDEX "_reports_v_version_key_metrics_parent_id_idx" ON "_reports_v_version_key_metrics" USING btree ("_parent_id");
  CREATE INDEX "_reports_v_parent_idx" ON "_reports_v" USING btree ("parent_id");
  CREATE INDEX "_reports_v_version_version_slug_idx" ON "_reports_v" USING btree ("version_slug");
  CREATE INDEX "_reports_v_version_version_year_idx" ON "_reports_v" USING btree ("version_year");
  CREATE INDEX "_reports_v_version_version_file_idx" ON "_reports_v" USING btree ("version_file_id");
  CREATE INDEX "_reports_v_version_seo_version_seo_open_graph_image_idx" ON "_reports_v" USING btree ("version_seo_open_graph_image_id");
  CREATE INDEX "_reports_v_version_version_workflow_status_idx" ON "_reports_v" USING btree ("version_workflow_status");
  CREATE INDEX "_reports_v_version_version_published_at_idx" ON "_reports_v" USING btree ("version_published_at");
  CREATE INDEX "_reports_v_version_version_archived_at_idx" ON "_reports_v" USING btree ("version_archived_at");
  CREATE INDEX "_reports_v_version_version_updated_at_idx" ON "_reports_v" USING btree ("version_updated_at");
  CREATE INDEX "_reports_v_version_version_created_at_idx" ON "_reports_v" USING btree ("version_created_at");
  CREATE INDEX "_reports_v_version_version__status_idx" ON "_reports_v" USING btree ("version__status");
  CREATE INDEX "_reports_v_created_at_idx" ON "_reports_v" USING btree ("created_at");
  CREATE INDEX "_reports_v_updated_at_idx" ON "_reports_v" USING btree ("updated_at");
  CREATE INDEX "_reports_v_latest_idx" ON "_reports_v" USING btree ("latest");
  CREATE INDEX "_reports_v_autosave_idx" ON "_reports_v" USING btree ("autosave");
  CREATE INDEX "_reports_v_rels_order_idx" ON "_reports_v_rels" USING btree ("order");
  CREATE INDEX "_reports_v_rels_parent_idx" ON "_reports_v_rels" USING btree ("parent_id");
  CREATE INDEX "_reports_v_rels_path_idx" ON "_reports_v_rels" USING btree ("path");
  CREATE INDEX "_reports_v_rels_categories_id_idx" ON "_reports_v_rels" USING btree ("categories_id");
  CREATE INDEX "audit_logs_actor_idx" ON "audit_logs" USING btree ("actor_id");
  CREATE INDEX "audit_logs_collection_slug_idx" ON "audit_logs" USING btree ("collection_slug");
  CREATE INDEX "audit_logs_document_id_idx" ON "audit_logs" USING btree ("document_id");
  CREATE INDEX "audit_logs_updated_at_idx" ON "audit_logs" USING btree ("updated_at");
  CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("reports_id");
  CREATE INDEX "payload_locked_documents_rels_audit_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_logs_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE INDEX "footer_links_order_idx" ON "footer_links" USING btree ("_order");
  CREATE INDEX "footer_links_parent_id_idx" ON "footer_links" USING btree ("_parent_id");
  CREATE INDEX "seo_defaults_seo_seo_open_graph_image_idx" ON "seo_defaults" USING btree ("seo_open_graph_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "news_rels" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "_news_v_rels" CASCADE;
  DROP TABLE "reports_key_metrics" CASCADE;
  DROP TABLE "reports" CASCADE;
  DROP TABLE "reports_rels" CASCADE;
  DROP TABLE "_reports_v_version_key_metrics" CASCADE;
  DROP TABLE "_reports_v" CASCADE;
  DROP TABLE "_reports_v_rels" CASCADE;
  DROP TABLE "audit_logs" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_links" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "seo_defaults" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_users_status";
  DROP TYPE "public"."enum_media_visibility";
  DROP TYPE "public"."enum_pages_hero_layout";
  DROP TYPE "public"."enum_pages_seo_robots";
  DROP TYPE "public"."enum_pages_seo_schema_type";
  DROP TYPE "public"."enum_pages_workflow_status";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_hero_layout";
  DROP TYPE "public"."enum__pages_v_version_seo_robots";
  DROP TYPE "public"."enum__pages_v_version_seo_schema_type";
  DROP TYPE "public"."enum__pages_v_version_workflow_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_news_hero_layout";
  DROP TYPE "public"."enum_news_seo_robots";
  DROP TYPE "public"."enum_news_seo_schema_type";
  DROP TYPE "public"."enum_news_workflow_status";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_hero_layout";
  DROP TYPE "public"."enum__news_v_version_seo_robots";
  DROP TYPE "public"."enum__news_v_version_seo_schema_type";
  DROP TYPE "public"."enum__news_v_version_workflow_status";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_reports_period";
  DROP TYPE "public"."enum_reports_report_type";
  DROP TYPE "public"."enum_reports_seo_robots";
  DROP TYPE "public"."enum_reports_seo_schema_type";
  DROP TYPE "public"."enum_reports_workflow_status";
  DROP TYPE "public"."enum_reports_status";
  DROP TYPE "public"."enum__reports_v_version_period";
  DROP TYPE "public"."enum__reports_v_version_report_type";
  DROP TYPE "public"."enum__reports_v_version_seo_robots";
  DROP TYPE "public"."enum__reports_v_version_seo_schema_type";
  DROP TYPE "public"."enum__reports_v_version_workflow_status";
  DROP TYPE "public"."enum__reports_v_version_status";
  DROP TYPE "public"."enum_audit_logs_action";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_seo_defaults_seo_robots";
  DROP TYPE "public"."enum_seo_defaults_seo_schema_type";`)
}
