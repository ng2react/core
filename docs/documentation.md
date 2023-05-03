# ng2react Documentation

ng2react is a tool that converts AngularJS components to React components using the OpenAI API. It consists of an IDE plugin, a core library, a CLI, and a feedback API.

![System Context Diagram](./diagrams/structurizr-1-SystemContext.png)

## Features
- **Convert AngularJS Components**: The plugin allows users to easily convert AngularJS components to React components by sending the components to the ng2react core library, which uses TypeScript for parsing AngularJS components and the OpenAI API to generate the React version of the component.

- **Feedback Submission**: The plugin enables users to submit feedback about the conversion results directly from the IDE. This feedback helps the ng2react team to identify areas for improvement and ensure the tool continues to meet user needs.

- **User-friendly Interface**: The ng2react IDE plugin is designed with usability in mind, providing a seamless experience for developers working with both AngularJS and React codebases.

## IDE Plugin

The ng2react IDE plugin is an essential component of the ng2react software system. It integrates with the user's development environment and provides an interface for converting AngularJS components to React components using the core library. The plugin also enables users to submit feedback about the conversion results directly to the feedback API.

Two types of IDE plugins are supported:
* **NodeJS Based IDE Plugins**: These plugins are built for IDEs that support NodeJS plugins, such as VSCode and Atom. They can use @ng2react/core directly.
* **Other IDE Plugins**: These plugins are built for IDEs that do not support NodeJS plugins, such as IntelliJ and Eclipse. They can be immpemented via the @ng2react/cli.


![IDE Containers Diagram](./diagrams/structurizr-1-IDE_Containers.png)

### NodeJS Based IDE Plugin
![NodeJS IDE Plugins](./diagrams/structurizr-1-NodeJS_IDE_Plugins.png)

### Other IDE Plugins
![Generic IDE Plugins](./diagrams/structurizr-1-Generic_IDE_Plugins.png)

## Ng2React
### Core

The ng2react core library is responsible for converting AngularJS components to React components. It leverages the TypeScript AST for parsing AngularJS components and uses the OpenAI API to generate the corresponding React components.


![Ng2React Core](./diagrams/structurizr-1-Ng2React_Core.png)

### CLI

The ng2react CLI is a command-line interface that enables developers to convert AngularJS components to React components without using an IDE plugin. It provides a convenient way for developers to integrate the ng2react functionality into their existing workflows and tooling.

![Ng2React Core](./diagrams/structurizr-1-Ng2React_CLI.png)

### Feedback API

The feedback API allows users to submit feedback about the conversion results directly from the ng2react IDE plugin. It stores the feedback data in a database for later analysis and review by the ng2react team. This feedback is essential for identifying areas for improvement and ensuring the tool continues to meet user needs.

![Feedback API](./diagrams/structurizr-1-Feedback_API.png)

### Feedback Analysis Client

The feedback analysis client is a tool used by the ng2react team to review and analyze the feedback submitted by users. It provides an interface for browsing, filtering, and analyzing feedback data stored in the feedback database. This tool helps the team identify trends, common issues, and areas for improvement in the ng2react system.

## Existing Plugins
### VSCode
![VSCode IDE Diagram](./diagrams/structurizr-1-IDE_Containers_VSCode.png)