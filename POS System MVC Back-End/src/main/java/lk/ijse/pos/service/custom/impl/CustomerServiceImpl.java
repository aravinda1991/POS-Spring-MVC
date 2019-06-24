package lk.ijse.pos.service.custom.impl;

import lk.ijse.pos.dto.CustomerDTO;
import lk.ijse.pos.entity.Customer;
import lk.ijse.pos.repository.CustomerRepository;
import lk.ijse.pos.service.custom.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public boolean isCustomerExists(String id) {
        return customerRepository.existsById(id);
    }

    @Override
    public CustomerDTO getCustomerById(String id) {
        Customer customer = customerRepository.getOne(id);
        CustomerDTO customerDTO = new CustomerDTO(customer.getId(), customer.getName(), customer.getAddress());
        return customerDTO;
    }

    public List<CustomerDTO> getAllCustomers() {
        List<CustomerDTO> customers = customerRepository.findAll().stream().map(customer -> new CustomerDTO(customer.getId(), customer.getName(), customer.getAddress())).collect(Collectors.toList());
        return customers;
    }

    public String saveCustomer(CustomerDTO dto) {
        return customerRepository.save(new Customer(dto.getId(), dto.getName(), dto.getAddress())).getId();
    }

    public void updateCustomer(CustomerDTO dto) {
        customerRepository.save(new Customer(dto.getId(), dto.getName(), dto.getAddress()));
    }

    public void removeCustomer(String id) {
        customerRepository.deleteById(id);
    }

}
