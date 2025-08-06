// config/config.js

const topics = [
  {
    name: 'HTML',
    url: 'https://www.w3schools.com/html/default.asp',
    baseUrl: 'https://www.w3schools.com/html/',
    folder: 'scraped_content/html'
  },
  {
    name: 'CSS',
    url: 'https://www.w3schools.com/css/default.asp',
    baseUrl: 'https://www.w3schools.com/css/',
    folder: 'scraped_content/css'
  },
  {
    name: 'JavaScript',
    url: 'https://www.w3schools.com/js/default.asp',
    baseUrl: 'https://www.w3schools.com/js/',
    folder: 'scraped_content/javascript'
  },
  {
    name: 'Python',
    url: 'https://www.w3schools.com/python/default.asp',
    baseUrl: 'https://www.w3schools.com/python/',
    folder: 'scraped_content/python'
  },
  {
    name: 'SQL',
    url: 'https://www.w3schools.com/sql/default.asp',
    baseUrl: 'https://www.w3schools.com/sql/',
    folder: 'scraped_content/sql'
  },
  {
    name: 'PHP',
    url: 'https://www.w3schools.com/php/default.asp',
    baseUrl: 'https://www.w3schools.com/php/',
    folder: 'scraped_content/php'
  },
  {
    name: 'Java',
    url: 'https://www.w3schools.com/java/default.asp',
    baseUrl: 'https://www.w3schools.com/java/',
    folder: 'scraped_content/java'
  },
  {
    name: 'Cplusplus',
    url: 'https://www.w3schools.com/cpp/default.asp',
    baseUrl: 'https://www.w3schools.com/cpp/',
    folder: 'scraped_content/cplusplus'
  },
  {
    name: 'Csharp',
    url: 'https://www.w3schools.com/cs/default.asp',
    baseUrl: 'https://www.w3schools.com/cs/',
    folder: 'scraped_content/csharp'
  },
  {
    name: 'W3CSS',
    url: 'https://www.w3schools.com/w3css/default.asp',
    baseUrl: 'https://www.w3schools.com/w3css/',
    folder: 'scraped_content/w3css'
  },
  {
    name: 'Bootstrap',
    url: 'https://www.w3schools.com/bootstrap/bootstrap_ver.asp',
    baseUrl: 'https://www.w3schools.com/bootstrap/',
    folder: 'scraped_content/bootstrap'
  },
  {
    name: 'React',
    url: 'https://www.w3schools.com/react/default.asp',
    baseUrl: 'https://www.w3schools.com/react/',
    folder: 'scraped_content/react'
  },
  {
    name: 'jQuery',
    url: 'https://www.w3schools.com/jquery/default.asp',
    baseUrl: 'https://www.w3schools.com/jquery/',
    folder: 'scraped_content/jquery'
  },
  {
    name: 'Angular',
    url: 'https://www.w3schools.com/angular/default.asp',
    baseUrl: 'https://www.w3schools.com/angular/',
    folder: 'scraped_content/angular'
  },
  {
    name: 'Nodejs',
    url: 'https://www.w3schools.com/nodejs/default.asp',
    baseUrl: 'https://www.w3schools.com/nodejs/',
    folder: 'scraped_content/nodejs'
  },
  {
    name: 'R',
    url: 'https://www.w3schools.com/r/default.asp',
    baseUrl: 'https://www.w3schools.com/r/',
    folder: 'scraped_content/r'
  },
  {
    name: 'Kotlin',
    url: 'https://www.w3schools.com/kotlin/default.asp',
    baseUrl: 'https://www.w3schools.com/kotlin/',
    folder: 'scraped_content/kotlin'
  },
  {
    name: 'Go',
    url: 'https://www.w3schools.com/go/default.asp',
    baseUrl: 'https://www.w3schools.com/go/',
    folder: 'scraped_content/go'
  },
  {
    name: 'Django',
    url: 'https://www.w3schools.com/django/default.asp',
    baseUrl: 'https://www.w3schools.com/django/',
    folder: 'scraped_content/django'
  },
  {
    name: 'TypeScript',
    url: 'https://www.w3schools.com/typescript/default.asp',
    baseUrl: 'https://www.w3schools.com/typescript/',
    folder: 'scraped_content/typescript'
  },
  {
    name: 'MachineLearning',
    url: 'https://www.w3schools.com/python/python_ml_getting_started.asp',
    baseUrl: 'https://www.w3schools.com/python/',
    folder: 'scraped_content/machinelearning'
  },
  {
    name: 'ArtificialIntelligence',
    url: 'https://www.w3schools.com/ai/default.asp',
    baseUrl: 'https://www.w3schools.com/ai/',
    folder: 'scraped_content/artificialintelligence'
  },
  {
    name: 'DataScience',
    url: 'https://www.w3schools.com/datascience/default.asp',
    baseUrl: 'https://www.w3schools.com/datascience/',
    folder: 'scraped_content/datascience'
  },
  {
    name: 'CyberSecurity',
    url: 'https://www.w3schools.com/cybersecurity/default.asp',
    baseUrl: 'https://www.w3schools.com/cybersecurity/',
    folder: 'scraped_content/cybersecurity'
  },
  {
    name: 'GameDevelopment',
    url: 'https://www.w3schools.com/gamedev/default.asp',
    baseUrl: 'https://www.w3schools.com/gamedev/',
    folder: 'scraped_content/gamedev'
  },
  {
    name: 'WebDevelopment',
    url: 'https://www.w3schools.com/whatis/default.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/webdevelopment'
  },
  {
    name: 'MobileDevelopment',
    url: 'https://www.w3schools.com/whatis/whatis_mobile_dev.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/mobiledevelopment'
  },
  {
    name: 'CloudComputing',
    url: 'https://www.w3schools.com/whatis/whatis_cloud_computing.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/cloudcomputing'
  },
  {
    name: 'DevOps',
    url: 'https://www.w3schools.com/whatis/whatis_devops.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/devops'
  },
  {
    name: 'Blockchain',
    url: 'https://www.w3schools.com/whatis/whatis_blockchain.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/blockchain'
  },
  {
    name: 'IoT',
    url: 'https://www.w3schools.com/whatis/whatis_iot.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/iot'
  },
  {
    name: 'BigData',
    url: 'https://www.w3schools.com/whatis/whatis_bigdata.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/bigdata'
  },
  {
    name: 'QuantumComputing',
    url: 'https://www.w3schools.com/whatis/whatis_quantum_computing.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/quantumcomputing'
  },
  {
    name: 'ARVR',
    url: 'https://www.w3schools.com/whatis/whatis_ar_vr.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/arvr'
  },
  {
    name: 'Robotics',
    url: 'https://www.w3schools.com/whatis/whatis_robotics.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/robotics'
  },
  {
    name: 'EdgeComputing',
    url: 'https://www.w3schools.com/whatis/whatis_edge_computing.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/edgecomputing'
  },
  {
    name: 'Serverless',
    url: 'https://www.w3schools.com/whatis/whatis_serverless.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/serverless'
  },
  {
    name: 'Microservices',
    url: 'https://www.w3schools.com/whatis/whatis_microservices.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/microservices'
  },
  {
    name: 'API',
    url: 'https://www.w3schools.com/whatis/whatis_api.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/api'
  },
  {
    name: 'UXUI',
    url: 'https://www.w3schools.com/whatis/whatis_ux_ui.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/uxui'
  },
  {
    name: 'Agile',
    url: 'https://www.w3schools.com/whatis/whatis_agile.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/agile'
  },
  {
    name: 'Scrum',
    url: 'https://www.w3schools.com/whatis/whatis_scrum.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/scrum'
  },
  {
    name: 'Kanban',
    url: 'https://www.w3schools.com/whatis/whatis_kanban.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/kanban'
  },
  {
    name: 'DevSecOps',
    url: 'https://www.w3schools.com/whatis/whatis_devsecops.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/devsecops'
  },
  {
    name: 'SiteReliabilityEngineering',
    url: 'https://www.w3schools.com/whatis/whatis_sre.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/sre'
  },
  {
    name: 'DataWarehousing',
    url: 'https://www.w3schools.com/whatis/whatis_data_warehousing.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/datawarehousing'
  },
  {
    name: 'ETL',
    url: 'https://www.w3schools.com/whatis/whatis_etl.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/etl'
  },
  {
    name: 'BusinessIntelligence',
    url: 'https://www.w3schools.com/whatis/whatis_business_intelligence.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/businessintelligence'
  },
  {
    name: 'DataMining',
    url: 'https://www.w3schools.com/whatis/whatis_data_mining.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/datamining'
  },
  {
    name: 'NaturalLanguageProcessing',
    url: 'https://www.w3schools.com/whatis/whatis_nlp.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/nlp'
  },
  {
    name: 'ComputerVision',
    url: 'https://www.w3schools.com/whatis/whatis_computer_vision.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/computervision'
  },
  {
    name: 'ReinforcementLearning',
    url: 'https://www.w3schools.com/whatis/whatis_reinforcement_learning.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/reinforcementlearning'
  },
  {
    name: 'NeuralNetworks',
    url: 'https://www.w3schools.com/whatis/whatis_neural_networks.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/neuralnetworks'
  },
  {
    name: 'DeepLearning',
    url: 'https://www.w3schools.com/whatis/whatis_deep_learning.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/deeplearning'
  },
  {
    name: 'GenerativeAI',
    url: 'https://www.w3schools.com/whatis/whatis_generative_ai.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/generativeai'
  },
  {
    name: 'PromptEngineering',
    url: 'https://www.w3schools.com/whatis/whatis_prompt_engineering.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/promptengineering'
  },
  {
    name: 'VectorDatabases',
    url: 'https://www.w3schools.com/whatis/whatis_vector_databases.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/vectordatabases'
  },
  {
    name: 'LLMs',
    url: 'https://www.w3schools.com/whatis/whatis_llm.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/llms'
  },
  {
    name: 'RAG',
    url: 'https://www.w3schools.com/whatis/whatis_rag.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/rag'
  },
  {
    name: 'AIEthics',
    url: 'https://www.w3schools.com/whatis/whatis_ai_ethics.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/aiethics'
  },
  {
    name: 'ExplainableAI',
    url: 'https://www.w3schools.com/whatis/whatis_explainable_ai.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/explainableai'
  },
  {
    name: 'FederatedLearning',
    url: 'https://www.w3schools.com/whatis/whatis_federated_learning.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/federatedlearning'
  },
  {
    name: 'DifferentialPrivacy',
    url: 'https://www.w3schools.com/whatis/whatis_differential_privacy.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/differentialprivacy'
  },
  {
    name: 'HomomorphicEncryption',
    url: 'https://www.w3schools.com/whatis/whatis_homomorphic_encryption.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/homomorphicencryption'
  },
  {
    name: 'QuantumMachineLearning',
    url: 'https://www.w3schools.com/whatis/whatis_quantum_machine_learning.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/quantummachinelearning'
  },
  {
    name: 'NeuromorphicComputing',
    url: 'https://www.w3schools.com/whatis/whatis_neuromorphic_computing.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/neuromorphiccomputing'
  },
  {
    name: 'DigitalTwins',
    url: 'https://www.w3schools.com/whatis/whatis_digital_twins.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/digitaltwins'
  },
  {
    name: 'Web3',
    url: 'https://www.w3schools.com/whatis/whatis_web3.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/web3'
  },
  {
    name: 'DAO',
    url: 'https://www.w3schools.com/whatis/whatis_dao.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/dao'
  },
  {
    name: 'DeFi',
    url: 'https://www.w3schools.com/whatis/whatis_defi.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/defi'
  },
  {
    name: 'NFT',
    url: 'https://www.w3schools.com/whatis/whatis_nft.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/nft'
  },
  {
    name: 'Metaverse',
    url: 'https://www.w3schools.com/whatis/whatis_metaverse.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/metaverse'
  },
  {
    name: 'P2E',
    url: 'https://www.w3schools.com/whatis/whatis_p2e.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/p2e'
  },
  {
    name: 'GameFi',
    url: 'https://www.w3schools.com/whatis/whatis_gamefi.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/gamefi'
  },
  {
    name: 'SocialFi',
    url: 'https://www.w3schools.com/whatis/whatis_socialfi.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/socialfi'
  },
  {
    name: 'DID',
    url: 'https://www.w3schools.com/whatis/whatis_did.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/did'
  },
  {
    name: 'SoulboundTokens',
    url: 'https://www.w3schools.com/whatis/whatis_soulbound_tokens.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/soulboundtokens'
  },
  {
    name: 'ZeroKnowledgeProofs',
    url: 'https://www.w3schools.com/whatis/whatis_zero_knowledge_proofs.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/zeroknowledgeproofs'
  },
  {
    name: 'HomomorphicEncryption',
    url: 'https://www.w3schools.com/whatis/whatis_homomorphic_encryption.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/homomorphicencryption'
  },
  {
    name: 'DecentralizedStorage',
    url: 'https://www.w3schools.com/whatis/whatis_decentralized_storage.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/decentralizedstorage'
  },
  {
    name: 'IPFS',
    url: 'https://www.w3schools.com/whatis/whatis_ipfs.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/ipfs'
  },
  {
    name: 'WebAssembly',
    url: 'https://www.w3schools.com/whatis/whatis_webassembly.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/webassembly'
  },
  {
    name: 'ProgressiveWebApps',
    url: 'https://www.w3schools.com/whatis/whatis_pwa.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/pwa'
  },
  {
    name: 'SinglePageApplications',
    url: 'https://www.w3schools.com/whatis/whatis_spa.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/spa'
  },
  {
    name: 'Jamstack',
    url: 'https://www.w3schools.com/whatis/whatis_jamstack.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/jamstack'
  },
  {
    name: 'HeadlessCMS',
    url: 'https://www.w3schools.com/whatis/whatis_headless_cms.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/headlesscms'
  },
  {
    name: 'GraphQL',
    url: 'https://www.w3schools.com/whatis/whatis_graphql.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/graphql'
  },
  {
    name: 'RESTfulAPI',
    url: 'https://www.w3schools.com/whatis/whatis_restful_api.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/restfulapi'
  },
  {
    name: 'SOAP',
    url: 'https://www.w3schools.com/whatis/whatis_soap.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/soap'
  },
  {
    name: 'gRPC',
    url: 'https://www.w3schools.com/whatis/whatis_grpc.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/grpc'
  },
  {
    name: 'WebSockets',
    url: 'https://www.w3schools.com/whatis/whatis_websockets.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/websockets'
  },
  {
    name: 'ServerSentEvents',
    url: 'https://www.w3schools.com/whatis/whatis_sse.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/serversentevents'
  },
  {
    name: 'OAuth',
    url: 'https://www.w3schools.com/whatis/whatis_oauth.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/oauth'
  },
  {
    name: 'OpenIDConnect',
    url: 'https://www.w3schools.com/whatis/whatis_openid_connect.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/openidconnect'
  },
  {
    name: 'JWT',
    url: 'https://www.w3schools.com/whatis/whatis_jwt.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/jwt'
  },
  {
    name: 'SAML',
    url: 'https://www.w3schools.com/whatis/whatis_saml.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/saml'
  },
  {
    name: 'LDAP',
    url: 'https://www.w3schools.com/whatis/whatis_ldap.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/ldap'
  },
  {
    name: 'Kerberos',
    url: 'https://www.w3schools.com/whatis/whatis_kerberos.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/kerberos'
  },
  {
    name: 'PKI',
    url: 'https://www.w3schools.com/whatis/whatis_pki.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/pki'
  },
  {
    name: 'SSL_TLS',
    url: 'https://www.w3schools.com/whatis/whatis_ssl_tls.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/ssl_tls'
  },
  {
    name: 'VPN',
    url: 'https://www.w3schools.com/whatis/whatis_vpn.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/vpn'
  },
  {
    name: 'Firewall',
    url: 'https://www.w3schools.com/whatis/whatis_firewall.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/firewall'
  },
  {
    name: 'IDS_IPS',
    url: 'https://www.w3schools.com/whatis/whatis_ids_ips.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/ids_ips'
  },
  {
    name: 'SIEM',
    url: 'https://www.w3schools.com/whatis/whatis_siem.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/siem'
  },
  {
    name: 'DLP',
    url: 'https://www.w3schools.com/whatis/whatis_dlp.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/dlp'
  },
  {
    name: 'EndpointSecurity',
    url: 'https://www.w3schools.com/whatis/whatis_endpoint_security.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/endpointsecurity'
  },
  {
    name: 'PenetrationTesting',
    url: 'https://www.w3schools.com/whatis/whatis_penetration_testing.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/penetrationtesting'
  },
  {
    name: 'VulnerabilityManagement',
    url: 'https://www.w3schools.com/whatis/whatis_vulnerability_management.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/vulnerabilitymanagement'
  },
  {
    name: 'IncidentResponse',
    url: 'https://www.w3schools.com/whatis/whatis_incident_response.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/incidentresponse'
  },
  {
    name: 'SecurityAuditing',
    url: 'https://www.w3schools.com/whatis/whatis_security_auditing.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/securityauditing'
  },
  {
    name: 'Compliance',
    url: 'https://www.w3schools.com/whatis/whatis_compliance.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/compliance'
  },
  {
    name: 'RiskManagement',
    url: 'https://www.w3schools.com/whatis/whatis_risk_management.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/riskmanagement'
  },
  {
    name: 'ThreatIntelligence',
    url: 'https://www.w3schools.com/whatis/whatis_threat_intelligence.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/threatintelligence'
  },
  {
    name: 'DigitalForensics',
    url: 'https://www.w3schools.com/whatis/whatis_digital_forensics.asp',
    baseUrl: 'https://www.w3schools.com/whatis/',
    folder: 'scraped_content/digitalforensics'
  }
];

module.exports = topics;