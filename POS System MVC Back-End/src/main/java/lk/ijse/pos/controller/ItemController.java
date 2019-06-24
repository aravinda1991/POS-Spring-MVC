package lk.ijse.pos.controller;


import lk.ijse.pos.dto.ItemDTO;
import lk.ijse.pos.service.custom.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RequestMapping("/api/v1/items")
@RestController
public class ItemController {

    @Autowired
    private ItemService itemService;

    @GetMapping
    public List<ItemDTO> getAllItems() {
        return itemService.getAllItems();
    }

    @GetMapping(value = "/{id:I\\d{3}}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ItemDTO> getItem(@PathVariable("id") String id) {

        ItemDTO dto = null;
        if (itemService.isItemExists(id)) {
            dto = itemService.getItemById(id);
        }
        return new ResponseEntity<ItemDTO>(dto, (dto != null) ? HttpStatus.OK : HttpStatus.NOT_FOUND);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveItem(@RequestBody ItemDTO item) {
        if (item.getCode().isEmpty() || item.getDescription().isEmpty() || String.valueOf(item.getUnitPrice()).isEmpty() || String.valueOf(item.getQtyOnHand()).isEmpty()) {
            return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
        } else {
            String itemCode = itemService.saveItem(item);
            return new ResponseEntity<String>(itemCode, HttpStatus.CREATED);
        }
    }

    @PutMapping(path = "/{id:I\\d{3}}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> updateIitem(@PathVariable("id") String id, @RequestBody ItemDTO item) {
        if (!itemService.isItemExists(id)) {
            return new ResponseEntity<Void>(HttpStatus.BAD_REQUEST);
        }
        if (item.getDescription().isEmpty() || String.valueOf(item.getUnitPrice()).isEmpty() || String.valueOf(item.getQtyOnHand()).isEmpty()) {
            return new ResponseEntity<Void>(HttpStatus.BAD_REQUEST);
        } else {
            item.setCode(id);
            itemService.updateItem(item);
            return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
        }
    }

    @DeleteMapping(path = "/{id:I\\d{3}}")
    public ResponseEntity<Void> deleteItem(@PathVariable("id") String id) {
        if (!itemService.isItemExists(id)) {
            return new ResponseEntity<Void>(HttpStatus.BAD_REQUEST);
        }
        itemService.deleteItem(id);
        return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
    }

}













