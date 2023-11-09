[![npm][npm-badge]][npm-badge-url]
[![license][npm-license]][npm-license-url]

[npm-badge]: https://img.shields.io/npm/v/@junobuild/core
[npm-badge-url]: https://www.npmjs.com/package/@junobuild/core
[npm-license]: https://img.shields.io/npm/l/@junobuild/core
[npm-license-url]: https://github.com/junobuild/juno-js/blob/main/LICENSE

# Juno JavaScript core SDK

JavaScript [core](../core/README.md) client for Juno minus DFINITY agent-js dependencies.

## Context

There might be a use case in which you are using the Juno core library in an application where you are already utilizing DFINITY's [agent-js](https://github.com/dfinity/agent-js/).

You might also be building your app with a framework such as Next.js, which can lead to issues when interpreting agent-js provided through our libraries.

For such use cases, you can use this specific library, which sets the DFINITY libraries as peer dependencies. This way, those dependencies will be packaged on your side.

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
