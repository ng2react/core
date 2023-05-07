workspace "ng2react" "A tool that converts AngularJS components to React using OpenAI API" {
    !docs ./arc42
    model {
        openAiApi = softwareSystem "OpenAI" "Public API for generative AI" "External"

        ng2react = softwareSystem "ng2react" "IDE Plugin" {
            feedbackApi = container "@ng2react/feedback" "API for submitting feedback from the IDE plugin" {
                feedbackDatabase = component "Feedback Database" "A database for storing feedback data" 
                feedbackRestService = component "Feedback Service" "Handles communication between the API and the database" "OpenAPI" {
                    feedbackRestService -> feedbackDatabase "Stores/Retrieves feedback"
                }
                feedbackViewer = component "Feedback Analysis Client" "A client for reviewing submitted feedback" {
                    this -> feedbackRestService "Retrieves feedback"
                }
            }

            ng2react_core = container "@ng2react/core" "Main Ng2React API" "NodeJS" {
                typescript = component "Typescript" "AST Parsing" "JavaScript" "External"
                ng2react_core_component = component "@ng2react/core" "Core business logic" "JavaScript" {
                    this -> typescript "Uses"
                    this -> openAiApi "Uses"
                }
            }

            ide_nodejs = container "NodeJS IDE" "IDEs that support JavaScript plugins" "IDE" {
                ng2react_vscode = component "@ng2react/vscode" "VSCode IDE Plugin" "JavaScript" {
                    this -> ng2react_core_component "Uses"
                    this -> feedbackRestService "Sends anlysis to"
                }
            }

            ng2react_cli = container "@ng2react/cli" "Command line interface for ng2react" "stdio" {
                typescript_cli = component "Typescript" "AST Parsing" "JavaScript" "External"
                ng2react_core_component_cli = component "@ng2react/core" "Core business logic" "JavaScript" {
                    this -> typescript_cli "Uses"
                    this -> openAiApi "Uses"
                }
                ng2react_cli_component = component "@ng2react/cli" "Command line interface for ng2react" "JavaScript" {
                    this -> ng2react_core_component_cli "Uses"
                }
            }

            ng2react_ide_generic = container "Generic IDE" "IDEs without native JavaScript support" "IntelliJ, Eclipse, NeoVim, etc."  {
                ng2react_intellij = component "@ng2react/intellij" "IntelliJ Plugin" "Kotlin" "Proposed" {
                    this -> ng2react_cli_component "Uses"
                }
                ng2react_neovim = component "@ng2react/NeoVim" "NeoVim Plugin" "Lua" "Proposed" {
                    this -> ng2react_cli_component "Uses"
                }
                ng2react_eclipse = component "@ng2react/eclipse" "Eclipse Plugin" "Java" "Proposed" {
                    this -> ng2react_cli_component "Uses"
                }   
            }
        }        

        product_contributor = person "Developer/Analist" "A contributor to the ng2react software system." {
            this -> feedbackViewer "Analyses data from"
        }
        
        generic_ide_user = person "User" "AngularJS/React developer who wants to convert AngularJS components to React" {
            this -> ide_nodejs "Uses"
            this -> ng2react_ide_generic "Uses"
        }

        deploymentEnvironment "Live" {
            deploymentNode "Developer Laptop" "" "Microsoft Windows 10 or Apple macOS" {
                deploymentNode "IDE" "" "An integrated development environment with ng2react plugin support" {
                    plugin = containerInstance ide_nodejs
                }
            }
            deploymentNode "Remote Server" "" "Feedback API" "" {
                deploymentNode "FeedbackAPI" "" "" {
                    // softwareSystemInstance feedbackApi
                    server = containerInstance feedbackApi

                }
            }
        }
    }

    views {
        systemContext ng2react "SystemContext" {
            include *
            autoLayout
        }

        container ng2react "IDE_Containers" {
            include *
            autoLayout lr
        }

        container ng2react "IDE_Containers_VSCode" {
            include *
            exclude ng2react_ide_generic ng2react_cli
            autoLayout
        }

        container ng2react "IDE_Containers_Generic" {
            include *
            exclude ng2react_vscode feedbackApi ide_nodejs product_contributor ng2react_core
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

        component ng2react_core "Ng2React_Core" {
            include *
            autoLayout lr
        }

        component ng2react_cli "Ng2React_CLI" {
            include *
            autoLayout lr
        }

        component feedbackApi "Feedback_API" {
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
