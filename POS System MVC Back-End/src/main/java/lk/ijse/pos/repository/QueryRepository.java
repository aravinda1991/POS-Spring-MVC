package lk.ijse.pos.repository;

import lk.ijse.pos.entity.CustomEntity;

import java.util.List;

public interface QueryRepository {

    List<CustomEntity> getOrdersTotal();

}
