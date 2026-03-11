-- 给 move_mbgp 表添加 i_id_carnet_d 列，用于关联 carnet_deplacement
ALTER TABLE test_pi.move_mbgp
    ADD COLUMN IF NOT EXISTS i_id_carnet_d INTEGER;
