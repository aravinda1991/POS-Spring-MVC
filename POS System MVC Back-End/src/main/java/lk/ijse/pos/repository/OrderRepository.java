package lk.ijse.pos.repository;

import lk.ijse.pos.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    // int getLastOrderId() throws Exception;

    Order getTopOrdersByOrderByIdDesc();
}
