package lk.ijse.pos.service.custom;

import lk.ijse.pos.dto.OrderDTO;
import lk.ijse.pos.service.SuperService;

public interface OrderService extends SuperService {

    void placeOrder(OrderDTO dto);

    int generateOrderId();

}
