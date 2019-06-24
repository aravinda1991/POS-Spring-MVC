package lk.ijse.pos.controller;

import lk.ijse.pos.dto.OrderDTO;
import lk.ijse.pos.service.custom.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RequestMapping("/api/v1/orders")
@RestController
public class OrderController {

    @Autowired
    private OrderService orderService;

   /* @GetMapping(params = "xid=true", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getOrderId() {

        String orderID = orderService.generateOrderId();
        // String orderID = "OD002";
        return new ResponseEntity<String>("\"" + orderID + "\"", HttpStatus.CREATED);
    }*/

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> getorderid() {

        int orderID = orderService.generateOrderId();
        return new ResponseEntity<Integer>(orderID, HttpStatus.OK);

    }


    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> saveOrder(@RequestBody OrderDTO order) {

        if (String.valueOf(order.getOrderId()).isEmpty() || order.getCustomerId().isEmpty() || order.getOrderDetails().isEmpty()) {
            return new ResponseEntity<Void>(HttpStatus.BAD_REQUEST);
        } else {
            orderService.placeOrder(order);
            return new ResponseEntity<Void>(HttpStatus.CREATED);
        }
    }

}
