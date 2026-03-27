package com.platform.recommendation.repository;

import com.platform.recommendation.model.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    @Query("SELECT r FROM Recommendation r WHERE LOWER(r.text) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY r.createdAt DESC")
    List<Recommendation> searchByText(@Param("query") String query);

    List<Recommendation> findAllByOrderByCreatedAtDesc();

    List<Recommendation> findAllByOrderByVotesDesc();

    List<Recommendation> findAllByOrderByCreatedAtAsc();
}
