-- 给 stop_mbgp 表添加 i_id_carnet_a 列，用于关联 carnet_activite
ALTER TABLE test_pi.stop_mbgp
    ADD COLUMN IF NOT EXISTS i_id_carnet_a INTEGER;
