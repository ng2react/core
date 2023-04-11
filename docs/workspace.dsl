workspace "ng2react" "A tool that converts AngularJS components to React using OpenAI API" {
    !docs .
    model {
        user = person "User" "A user of the ng2react software system."
        developer = person "Developer" "A developer of the ng2react software system."

        openAiApi = softwareSystem "OpenAI" "Public API for generative AI" "External"

        ng2react = softwareSystem "ng2react" "IDE Plugin" {
            ng2react_plugin = container "@ng2react/plugin" "IDE Plugin" "NPM" 
            ng2react_core = container "@ng2react/core" "Core business logic" "NPM"
            typescript = container "Typescript" "AST Parsing" "NPM" "External"
            ng2react_cli = container "@ng2react/cli" "Command line interface for ng2react" "NPX"
        }        

        feedbackApi = softwareSystem "@ng2react/feedback" "API for submitting feedback from the IDE plugin" {
            feedbackRestService = container "Feedback Service" "Handles communication between the API and the database" "OpenAPI"
            feedbackDatabase = container "Feedback Database" "A database for storing feedback data"
            feedbackViewer = container "Feedback Analysis Client" "A client for reviewing submitted feedback"
        }

        user -> ng2react_cli "Uses"
        user -> ng2react_plugin "Uses"
        ng2react_plugin -> ng2react_core "Uses"
        ng2react_plugin -> feedbackRestService "Sends user feedback"
        ng2react_cli -> ng2react_core "Uses"
        ng2react_core -> openAiApi "Uses"
        ng2react_core -> typescript "Uses"

        feedbackViewer -> feedbackRestService "Retrieves feedback"
        feedbackRestService -> feedbackDatabase "Stores/Retrieves feedback"

        developer -> feedbackViewer "Uses"

        deploymentEnvironment "Live" {
            deploymentNode "Developer Laptop" "" "Microsoft Windows 10 or Apple macOS" {
                deploymentNode "IDE" "" "An integrated development environment with ng2react plugin support" {
                    plugin = containerInstance ng2react_plugin
                }
            }
            deploymentNode "Remote Server" "" "Feedback API" "" {
                deploymentNode "FeedbackAPI" "" "" "" {
                    softwareSystemInstance feedbackApi

                }
            }
        }
    }

    views {
        systemLandscape "SystemLandscape" {
            include *
            # exclude ng2react_cli
            autoLayout
        }

        systemContext ng2react "SystemContext" {
            include *
            # exclude ng2react_cli
            autoLayout
        }

        container ng2react "IDE_Containers" {
            include *
            # exclude ng2react_cli
            autoLayout lr
        }

        #component ng2react_plugin "Plugin_Components" {
        #    include *
        #    autoLayout lr
        #}

        #component ng2react_core "Core_Components" {
        #    include *
        #    autoLayout lr
        #}

        # container ng2react_cli "Cli_Containers" {
        #     include *
        #     autoLayout lr
        # }

        container feedbackApi "Feedback_API" {
            include *
            autoLayout lr
        }

        # component feedbackRestService "Feedback_API_Service" {
        #     include *
        #     autoLayout lr
        # }

        deployment ng2react "Live" {
            include *
            # animation {
            #     developerSinglePageApplicationInstance
            #     developerWebApplicationInstance developerApiApplicationInstance
            #     developerDatabaseInstance
            # }
            autoLayout
            description "An example development deployment scenario for the Internet Banking System."
        }

        theme default

        styles {
            element "External" {
                background #aaaaaa
            }
        }
    }
}
