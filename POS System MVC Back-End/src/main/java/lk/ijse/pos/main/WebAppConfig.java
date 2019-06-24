package lk.ijse.pos.main;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@EnableWebMvc
@ComponentScan("lk.ijse.pos")
@Configuration
public class WebAppConfig {
}
