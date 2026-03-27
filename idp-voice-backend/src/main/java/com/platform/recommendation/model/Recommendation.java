package com.platform.recommendation.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "recommendations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 250)
    @Column(nullable = false, length = 250)
    private String text;

    @Builder.Default
    @Column(nullable = false)
    private int votes = 0;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Size(max = 200)
    @Column(name = "submitter_name", length = 200)
    private String submitterName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
    }
}
