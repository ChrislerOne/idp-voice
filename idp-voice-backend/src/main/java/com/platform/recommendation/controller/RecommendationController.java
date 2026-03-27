package com.platform.recommendation.controller;

import com.platform.recommendation.model.Recommendation;
import com.platform.recommendation.service.RecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService service;

    @GetMapping
    public List<Recommendation> list(@RequestParam(defaultValue = "newest") String sort) {
        return service.list(sort);
    }

    @GetMapping("/search")
    public List<Recommendation> search(@RequestParam String q) {
        return service.search(q);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Recommendation create(@Valid @RequestBody Recommendation recommendation) {
        return service.create(recommendation);
    }

    @PostMapping("/{id}/vote")
    public Recommendation vote(@PathVariable Long id) {
        return service.vote(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
