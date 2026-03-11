-- 给 stop_mbgp 表添加 commentaire 字段，用于存储用户手动填写的备注
ALTER TABLE test_pi.stop_mbgp ADD COLUMN IF NOT EXISTS commentaire VARCHAR(255);
