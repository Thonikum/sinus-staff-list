# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog][Keep a Changelog] and this project adheres to [Semantic Versioning][Semantic Versioning].

## [Unreleased]

- /

---

## [Released]

## [1.2.0] - 2020-05-25

### Added
- group assigment listeners ([#3](https://github.com/RLNT/sinus-staff-list/issues/3))
  - description is now updated when a staff group is added or removed
- database validation
  - config changes while the bot was offline are now recognized
- template formatting ([#1](https://github.com/RLNT/sinus-staff-list/issues/1))

### Removed
- unnecessary checks

### Fixed
- move event checking for the wrong output of the staff group detection function


## [1.1.0] - 2020-05-22

### Added
- more explanation to the config how to configure the script and how it works

### Changed
- main script function to use placeholder instead of SinusBot
- extracted member sort function to get more performance and reduce unnecessary checks
- only groups with stored members are shown now


## [1.0.0] - 2020-05-22

- initial release

---

<!-- Links -->
[Keep a Changelog]: https://keepachangelog.com/
[Semantic Versioning]: https://semver.org/

<!-- Versions -->
[Unreleased]: https://github.com/RLNT/sinus-staff-list/compare/v1.0.0...HEAD
[Released]: https://github.com/RLNT/sinus-staff-list/releases
[1.2.0]: https://github.com/RLNT/sinus-staff-list/compare/v1.1.0..v1.2.0
[1.1.0]: https://github.com/RLNT/sinus-staff-list/compare/v1.0.0..v1.1.0
[1.0.0]: https://github.com/RLNT/sinus-staff-list/releases/v1.0.0
