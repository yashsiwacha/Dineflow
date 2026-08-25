package com.dineflow.backend.archunit;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.*;
import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;

@AnalyzeClasses(
    packages = "com.dineflow.backend",
    importOptions = {ImportOption.DoNotIncludeTests.class}
)
public class ArchitectureTest {

    @ArchTest
    static final ArchRule domainMustNotDependOnSpring =
        noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat()
            .resideInAnyPackage(
                "org.springframework..",
                "jakarta.persistence..",
                "org.hibernate.."
            )
            .because("Domain layer must be framework-agnostic (ARCHITECTURE.md Rule 2)");

    @ArchTest
    static final ArchRule domainMustNotDependOnInfrastructureOrAdapter =
        noClasses()
            .that().resideInAPackage("..domain..")
            .should().dependOnClassesThat()
            .resideInAnyPackage(
                "..infrastructure..",
                "..adapter.."
            )
            .because("Domain layer must not know about infrastructure or adapters (ARCHITECTURE.md Rule 2)");

    @ArchTest
    static final ArchRule applicationMustNotDependOnInfrastructureOrAdapter =
        noClasses()
            .that().resideInAPackage("..application..")
            .should().dependOnClassesThat()
            .resideInAnyPackage(
                "..infrastructure..",
                "..adapter.."
            )
            .because("Application layer must not depend on infrastructure or adapters directly");

    @ArchTest
    static final ArchRule controllersMustBeInWebAdapterLayer =
        classes()
            .that().areAnnotatedWith(RestController.class)
            .should().resideInAPackage("..adapter.in.web..")
            .because("Controllers are entry adapters and belong in adapter.in.web");

    @ArchTest
    static final ArchRule repositoriesMustBeInInfrastructurePersistence =
        classes()
            .that().areAnnotatedWith(Repository.class)
            .should().resideInAPackage("..infrastructure.persistence.repository..")
            .because("JPA repositories belong in the persistence infrastructure layer");

    @ArchTest
    static final ArchRule jpaEntitiesMustNotBeInDomainModel =
        noClasses()
            .that().resideInAPackage("..domain.model..")
            .should().beAnnotatedWith("jakarta.persistence.Entity")
            .because("JPA @Entity belongs in infrastructure.persistence.entity, not domain.model");

    @ArchTest
    static final ArchRule noCyclicDependencies =
        slices()
            .matching("com.dineflow.backend.(*)..")
            .should().beFreeOfCycles()
            .because("Cyclic dependencies violate clean modular design");
}
