package com.platform.recommendation.service;

import com.platform.recommendation.model.Recommendation;
import com.platform.recommendation.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository repository;

    public List<Recommendation> list(String sort) {
        return switch (sort) {
            case "most-voted" -> repository.findAllByOrderByVotesDesc();
            case "oldest" -> repository.findAllByOrderByCreatedAtAsc();
            default -> repository.findAllByOrderByCreatedAtDesc();
        };
    }

    public List<Recommendation> search(String query) {
        return repository.searchByText(query);
    }

    public Recommendation create(Recommendation recommendation) {
        recommendation.setId(null);
        recommendation.setVotes(1);
        return repository.save(recommendation);
    }

    public Recommendation vote(Long id) {
        Recommendation rec = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        rec.setVotes(rec.getVotes() + 1);
        return repository.save(rec);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        repository.deleteById(id);
    }
}
