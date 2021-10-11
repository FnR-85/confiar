package com.ncr.challenge.repositories;

import java.util.List;
import java.util.Optional;

import com.ncr.challenge.entities.Customer;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends CrudRepository<Customer, Long> {
  // public abstract <T> List<T> findAllBy(Class<T> type);
  public abstract List<ReducedCustomer> findAllBy();
  public abstract List<Customer> findByName(String name);
  public abstract List<Customer> findByLastName(String lastName);
  public abstract Optional<Customer> findByMail(String mail);

  interface ReducedCustomer {
    Long   getId();
    String getName();
    String getLastName();
    String getMail();
  }
  
}
