## [1.0.1](https://github.com/9erikSantos6/cronalize-api/compare/v1.0.0...v1.0.1) (2026-07-22)


### Bug Fixes

* **ci:** changes the github token to an automatic value for semantic release ([508cf19](https://github.com/9erikSantos6/cronalize-api/commit/508cf19d1271b1216460ceab2f3970e8e0890f31))

# 1.0.0 (2026-07-22)


### Bug Fixes

* **ci/build:** adds the @semantic-release/exec package ([6643cd0](https://github.com/9erikSantos6/cronalize-api/commit/6643cd02cadf05b8afa089ee6726bc885b730440))
* **ci:** add @semantic-release/exec to bump package.json version with pnpm ([699924d](https://github.com/9erikSantos6/cronalize-api/commit/699924d7211610e2d07442d7c7d6e7595b45ad31))
* **ci:** correct semantic-release config - add @semantic-release/git and fix @semantic-release/github options ([bceae07](https://github.com/9erikSantos6/cronalize-api/commit/bceae07eebbcd1f4d07cc971fd734215ad0b157a))
* **ci:** fix the semantic release access key and organize the workflow ([15b9fd8](https://github.com/9erikSantos6/cronalize-api/commit/15b9fd8d274fd69db95ba2e2d02697ae89985aaf))
* **ci:** remove publish plugin for private repo - semantic-release only creates git tag and changelog ([5559105](https://github.com/9erikSantos6/cronalize-api/commit/5559105a5734ee23b64d7cc7f34b90594526dd0f))
* **ci:** reorder plugins - exec before changelog to avoid unclean working tree ([7e77441](https://github.com/9erikSantos6/cronalize-api/commit/7e774417a60faee8600c13262e989141f523fa75))
* **ci:** resolves .env dependencies before running semantic-release ([4496b6c](https://github.com/9erikSantos6/cronalize-api/commit/4496b6caab88e35bad804035edb0fc0aeb5f3369))
* **ci:** set NPM_CONFIG_ENGINE_STRICT to false ([b470844](https://github.com/9erikSantos6/cronalize-api/commit/b470844d924a2852754a9b0c99fcd9ba114cf15c))
* **ci:** try configuring semantic release to allow unrestricted development engines ([33a3656](https://github.com/9erikSantos6/cronalize-api/commit/33a3656f0ef7a6de10bdb3c8fbf08f6bbdeadf95))
* **ci:** try to fix read and write permissions on the repository ([dbc15b1](https://github.com/9erikSantos6/cronalize-api/commit/dbc15b197ead8e743d3ab7c25210323f7a9482e9))
* **ci:** update test suite verification to include env setup ([38a6347](https://github.com/9erikSantos6/cronalize-api/commit/38a6347d27008ce4606b226bcba0ebeed6fa12db))
* **config:** fix: make dotenvx ignore missing .env file with fallback path ([be8b5c0](https://github.com/9erikSantos6/cronalize-api/commit/be8b5c08765476a48285b668b7d29fc4f7f7ee76))
* **env:** adds dummy values ​​to env.example ([0c95d74](https://github.com/9erikSantos6/cronalize-api/commit/0c95d74adb5e824686d9e414dd3c3903c149ee53))
* **env:** fix env.example sintaxe ([3b44640](https://github.com/9erikSantos6/cronalize-api/commit/3b446409a7e380324392c0e0d792707eb8eafec8))
* **release:** disable npm plugin publishing and build for semantic-release ([1789e27](https://github.com/9erikSantos6/cronalize-api/commit/1789e2716f1d1dd2677b18281b05e3452e7c8df0))


### Features

* set up project scaffolding with environment config and testing ([d001b41](https://github.com/9erikSantos6/cronalize-api/commit/d001b4188e354c3b5d55371913c6fcfd80971223))
