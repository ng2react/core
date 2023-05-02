workspace "ng2react" "A tool that converts AngularJS components to React using OpenAI API" {
    !docs .
    model {
        generic_ide_user = person "Generic IDE User" "A user of the non-JavaScript IDE"
        vscode_user = person "VSCode IDE User" "A user of the VSCode IDE"
        developer = person "Developer" "A developer of the ng2react software system."

        openAiApi = softwareSystem "OpenAI" "Public API for generative AI" "External"

        feedbackApi = softwareSystem "@ng2react/feedback" "API for submitting feedback from the IDE plugin" {
            feedbackRestService = container "Feedback Service" "Handles communication between the API and the database" "OpenAPI"
            feedbackDatabase = container "Feedback Database" "A database for storing feedback data"
            feedbackViewer = container "Feedback Analysis Client" "A client for reviewing submitted feedback"
        }

        ng2react = softwareSystem "ng2react" "IDE Plugin" {
            ng2react_core = container "@ng2react/core" "Core business logic" "JavaScript"
            typescript = container "Typescript" "AST Parsing" "NPM" "External"
            ng2react_cli = container "@ng2react/cli" "Command line interface for ng2react" "stdio"

            ide_nodejs = container "NodeJS IDE" "IDEs that support JavaScript plugins" "IDE" {
                ng2react_vscode = component "@ng2react/vscode" "VSCode IDE Plugin" "JavaScript" {
                    this -> ng2react_core "Uses"
                }
            }
            ng2react_ide_generic = container "Generic IDE" "IDEs without native JavaScript support" "IntelliJ, Eclipse, NeoVim, etc."  {
                ng2react_intellij = component "@ng2react/intellij" "IntelliJ Plugin" "Kotlin" "Proposed" {
                    this -> ng2react_cli "Uses"
                }
                ng2react_neovim = component "@ng2react/NeoVim" "NeoVim Plugin" "Lua" "Proposed" {
                    this -> ng2react_cli "Uses"
                }
                ng2react_eclipse = component "@ng2react/eclipse" "Eclipse Plugin" "Java" "Proposed" {
                    this -> ng2react_cli "Uses"
                }
            }
        }        

        vscode_user -> ide_nodejs "Uses"
        ng2react_vscode -> feedbackRestService "Sends useage data"
        // ng2react_vscode -> ng2react_core "Uses"
        ng2react_cli -> ng2react_core "Uses"
        ng2react_core -> openAiApi "Uses"
        ng2react_core -> typescript "Uses"

        generic_ide_user -> ng2react_ide_generic "Uses"
        // ng2react_ide_generic -> feedbackRestService "Sends user feedback"

        feedbackViewer -> feedbackRestService "Retrieves feedback"
        feedbackRestService -> feedbackDatabase "Stores/Retrieves feedback"

        developer -> feedbackViewer "Uses"

        deploymentEnvironment "Live" {
            deploymentNode "Developer Laptop" "" "Microsoft Windows 10 or Apple macOS" {
                deploymentNode "IDE" "" "An integrated development environment with ng2react plugin support" {
                    plugin = containerInstance ide_nodejs
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

        container ng2react "IDE_Containers_VSCode" {
            include *
            exclude ng2react_ide_generic generic_ide_user ng2react_cli
            autoLayout
        }

        container ng2react "IDE_Containers_Generic" {
            include *
            exclude ng2react_vscode feedbackApi ide_nodejs vscode_user
            autoLayout
        }


        component ng2react_ide_generic "Generic_IDE_Plugins" {
            include *
            autoLayout lr
        }

        component ide_nodejs "NodeJS_IDE_Plugins" {
            include *
            autoLayout lr
        }

        container feedbackApi "Feedback_API" {
            include *
            autoLayout lr
        }

        deployment ng2react "Live" {
            include *
            autoLayout
            description "An example development deployment scenario for the Internet Banking System."
        }

        theme default

        styles {
            element "External" {
                background #aaaaaa
            }

            element "Proposed" {
                background #b7e1cd
            
        }
    }
}
