package lk.ijse.pos.repository.impl;

import lk.ijse.pos.entity.CustomEntity;
import lk.ijse.pos.repository.QueryRepository;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class QueryRepositoryImpl implements QueryRepository {

    private Session session;

    @Override
    public List<CustomEntity> getOrdersTotal() {

        List<Object[]> list = session.createNativeQuery("SELECT id, SUM(qty * unitPrice) AS Total FROM `Order` INNER JOIN\n" +
                "  OrderDetail OD on `Order`.id = OD.orderId GROUP BY id").getResultList();

        List<CustomEntity> al = new ArrayList<>();

        for (Object[] objects : list) {
            al.add(new CustomEntity((Integer) objects[0], (Double) objects[1]));
        }

        return al;
    }


}
