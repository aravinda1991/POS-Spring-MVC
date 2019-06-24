package lk.ijse.pos.service.custom.impl;

import lk.ijse.pos.dto.OrderDTO;
import lk.ijse.pos.dto.OrderDetailDTO;
import lk.ijse.pos.entity.Customer;
import lk.ijse.pos.entity.Item;
import lk.ijse.pos.entity.Order;
import lk.ijse.pos.entity.OrderDetail;
import lk.ijse.pos.repository.CustomerRepository;
import lk.ijse.pos.repository.ItemRepository;
import lk.ijse.pos.repository.OrderDetailRepository;
import lk.ijse.pos.repository.OrderRepository;
import lk.ijse.pos.service.custom.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private CustomerRepository customerRepository;

    public void placeOrder(OrderDTO order) {

        // Find the customer
        Customer customer = customerRepository.getOne(order.getCustomerId());
        // Save the order
        orderRepository.save(new Order(order.getOrderId(), order.getOrderDate(), customer));
        //  Save OrderDetails and Update the Qty.
        for (OrderDetailDTO dto : order.getOrderDetails()) {
            orderDetailRepository.save(new OrderDetail(dto.getOrderId(), dto.getItemCode(), dto.getQty(), dto.getUnitPrice()));
            // Find the item
            Item item = itemRepository.getOne(dto.getItemCode());
            // Calculate the qty. on hand
            int qty = item.getQtyOnHand() - dto.getQty();
            // Update the new qty.on hand
            item.setQtyOnHand(qty);
        }

    }

    @Override
    public int generateOrderId() {
         return orderRepository.getTopOrdersByOrderByIdDesc().getId() + 1;
//        return null;
    }


}
