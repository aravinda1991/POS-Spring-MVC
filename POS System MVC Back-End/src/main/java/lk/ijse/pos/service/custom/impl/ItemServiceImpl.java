package lk.ijse.pos.service.custom.impl;

import lk.ijse.pos.dto.ItemDTO;
import lk.ijse.pos.entity.Item;
import lk.ijse.pos.repository.ItemRepository;
import lk.ijse.pos.service.custom.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Override
    public boolean isItemExists(String id) {
        return itemRepository.existsById(id);
    }

    @Override
    public ItemDTO getItemById(String id) {
        Item item = itemRepository.getOne(id);
        ItemDTO itemDTO = new ItemDTO(item.getCode(), item.getDescription(), item.getUnitPrice(), item.getQtyOnHand());
        return itemDTO;
    }

    public List<ItemDTO> getAllItems() {
        List<ItemDTO> items = itemRepository.findAll().stream().map(item -> new ItemDTO(item.getCode(), item.getDescription(), item.getUnitPrice(), item.getQtyOnHand())).collect(Collectors.toList());
        return items;
    }

    public String saveItem(ItemDTO dto) {
        return itemRepository.save(new Item(dto.getCode(), dto.getDescription(), dto.getUnitPrice(), dto.getQtyOnHand())).getCode();
    }

    public void updateItem(ItemDTO dto) {
        itemRepository.save(new Item(dto.getCode(), dto.getDescription(), dto.getUnitPrice(), dto.getQtyOnHand()));
    }

    public void deleteItem(String code) {
        itemRepository.deleteById(code);
    }

}

