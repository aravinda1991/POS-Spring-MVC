package lk.ijse.pos.service.custom;

import lk.ijse.pos.dto.ItemDTO;
import lk.ijse.pos.service.SuperService;

import java.util.List;

public interface ItemService extends SuperService {

    List<ItemDTO> getAllItems();

    String saveItem(ItemDTO dto);

    void updateItem(ItemDTO dto);

    void deleteItem(String id);

    ItemDTO getItemById(String id);

    boolean isItemExists(String id);

}
