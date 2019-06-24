package lk.ijse.pos.service.custom;

import lk.ijse.pos.service.SuperService;
import lk.ijse.pos.dto.CustomerDTO;

import java.util.List;

public interface CustomerService extends SuperService {

    List<CustomerDTO> getAllCustomers();

    String saveCustomer(CustomerDTO dto);

    void updateCustomer(CustomerDTO dto);

    void removeCustomer(String id);

    CustomerDTO getCustomerById(String id);

    boolean isCustomerExists(String id);

}
