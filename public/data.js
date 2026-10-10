const modules = [
  {id:'networking',n:'01',title:'Networking Basics',desc:'DNS, connectivity, latency, timeouts and client/server flow.',slides:[
    ['Concept','Think in layers: device → DNS → network path → server/application. Start with scope and observable symptoms before choosing a fix.'],
    ['Example','Customer says the app times out. Ask whether other websites work, whether other users are affected, and capture the exact error/time.'],
    ['Recall','A customer cannot open your application but other websites work. What is the best first direction?',[['Investigate the application path and collect exact evidence',1],['Assume there is no internet',0],['Ask for the customer password',0]]]
  ]},
  {id:'api',n:'02',title:'REST API Basics',desc:'Requests, responses, methods, headers, JSON and status codes.',slides:[
    ['Concept','A client sends an HTTP request to an endpoint. The server processes it and returns a response containing a status code, headers and often JSON.'],
    ['Example','401 points toward authentication evidence; 403 toward access/authorization; 404 toward a missing resource/path; 429 toward rate limiting; 5xx toward server-side processing.'],
    ['Recall','A request returns 401 Unauthorized. What should you investigate first?',[['Authentication method, request evidence and credential validity through the approved process',1],['Database indexes',0],['Ask for the secret key in chat',0]]]
  ]},
  {id:'sql',n:'03',title:'SQL & Databases',desc:'Tables, keys, queries, filtering and support investigations.',slides:[
    ['Concept','A table contains records. Rows are records, columns are attributes, and a primary key identifies a record. Queries retrieve specific information.'],
    ['Example','For a missing-order investigation, identify the approved account/order reference, check record state and timestamps where authorized, then compare expected versus actual.'],
    ['Recall','What is the main purpose of a primary key?',[['Uniquely identify a record in a table',1],['Encrypt every database value',0],['Automatically repair bad data',0]]]
  ]},
  {id:'cloud',n:'04',title:'Cloud Basics',desc:'Compute, storage, databases, load balancers, logs and monitoring.',slides:[
    ['Concept','Use a simple model: compute runs workloads, storage keeps files/data, databases hold structured application data, and monitoring/logging provides evidence about behavior.'],
    ['Example','“The cloud is down” is not a diagnosis. Narrow the affected component, user scope, symptom, timestamps and available monitoring evidence.'],
    ['Recall','Why is “the cloud is down” insufficient?',[['Cloud environments have multiple components; identify the affected service and symptom',1],['Cloud systems never fail',0],['Support should never investigate',0]]]
  ]},
  {id:'auth',n:'05',title:'Authentication',desc:'Sessions, tokens, credentials, 401 vs 403 and safe handling.',slides:[
    ['Concept','Authentication asks “who are you?” Authorization asks “what are you allowed to do?” A 401 and 403 are different signals.'],
    ['Example','Follow the approved credential recovery process. Never ask customers to paste passwords, private keys, seed phrases or other secrets into support channels.'],
    ['Recall','Which support behavior is safest?',[['Follow the approved recovery process without collecting the customer secret',1],['Ask for the password to test it',0],['Save the token in personal notes',0]]]
  ]},
  {id:'webhooks',n:'06',title:'Webhooks',desc:'Events, delivery, retries, endpoints and evidence collection.',slides:[
    ['Concept','A webhook sends an event notification from one system to another, commonly as an HTTP request to a receiving endpoint.'],
    ['Example','For a missing webhook, separate event generation from delivery: was the event created, was a delivery attempt made, what response occurred, and what timestamps/evidence exist?'],
    ['Recall','A webhook event never arrived. What is a useful first direction?',[['Determine whether the event was generated and whether a delivery attempt exists',1],['Assume the customer server is broken',0],['Ask for a private key',0]]]
  ]}
];

const practiceScenarios = {
  networking: [
    {
      title:'Application unavailable for one customer',
      scenario:'A customer says your web application will not load. They confirm other websites are working normally. What is the best next direction?',
      answers:[
        ['Ask for the exact error/symptom and determine whether the problem is specific to the application.', true],
        ['Tell the customer their internet is definitely down.', false],
        ['Ask for their password before investigating.', false],
        ['Immediately declare a platform-wide outage.', false]
      ],
      why:'Other websites working is useful scope evidence. Next, narrow the application-specific failure with the exact symptom and approved diagnostics.'
    },
    {
      title:'Intermittent timeout',
      scenario:'A customer reports that the application sometimes loads and sometimes times out. What evidence is most useful to collect first?',
      answers:[
        ['Timestamps, frequency/pattern, exact error and whether other users are affected.', true],
        ['The customer’s account password.', false],
        ['A guess about the database without evidence.', false],
        ['Only the customer’s browser name.', false]
      ],
      why:'Intermittent problems benefit from timestamps, reproducibility, scope and exact symptoms. These help distinguish client, network, dependency and application patterns.'
    },
    {
      title:'DNS suspicion',
      scenario:'A customer cannot resolve the application hostname, while another known IP-based service is reachable. What concept should you investigate?',
      answers:[
        ['DNS/name resolution and the evidence showing whether the hostname resolves correctly.', true],
        ['Password complexity.', false],
        ['Database indexing.', false],
        ['Subscription cancellation policy.', false]
      ],
      why:'DNS translates hostnames to addresses. A hostname-specific failure can point toward name-resolution evidence, but the investigation should verify rather than assume the cause.'
    }
  ],
  api: [
    {
      title:'401 response',
      scenario:'An API request returns HTTP 401. What is the most appropriate first investigation direction?',
      answers:[
        ['Inspect the authentication method and request evidence according to the documented process.', true],
        ['Immediately change database permissions.', false],
        ['Ask the customer to paste their secret token into chat.', false],
        ['Assume the server is completely down.', false]
      ],
      why:'401 is an authentication signal. Investigate the request and authentication evidence while protecting secrets.'
    },
    {
      title:'429 response',
      scenario:'A customer reports repeated HTTP 429 responses from an API. What should you investigate?',
      answers:[
        ['Request volume, rate-limit behavior and the relevant documented limit/retry guidance.', true],
        ['Whether their password contains a number.', false],
        ['Whether DNS records are encrypted.', false],
        ['Delete their API account.', false]
      ],
      why:'429 indicates rate limiting. Support should establish request frequency, scope and the approved retry/limit guidance rather than guessing.'
    },
    {
      title:'Missing field',
      scenario:'An API request returns a validation error indicating a required field is missing. What is the useful next step?',
      answers:[
        ['Compare the request payload with the documented required fields and identify the missing/incorrect value without exposing secrets.', true],
        ['Restart every server.', false],
        ['Ask the customer to send all credentials.', false],
        ['Assume the database is corrupted.', false]
      ],
      why:'A validation error is best investigated against the documented request contract and the actual request evidence.'
    }
  ],
  sql: [
    {
      title:'Missing record',
      scenario:'A customer says an expected order is missing. What is a useful database investigation approach?',
      answers:[
        ['Use an approved identifier to locate the record, inspect relevant state/timestamps and compare expected vs actual.', true],
        ['Change the record immediately.', false],
        ['Ask for the customer’s password.', false],
        ['Run unrelated queries until something looks different.', false]
      ],
      why:'Support investigation should establish evidence and state before making any change. Production data changes should follow authorized procedures.'
    },
    {
      title:'Duplicate result',
      scenario:'A report shows two records where one was expected. What should you establish first?',
      answers:[
        ['Confirm what “duplicate” means, identify the records and inspect the relevant identifiers/state before assuming a data defect.', true],
        ['Delete one record immediately.', false],
        ['Blame the customer.', false],
        ['Ignore the issue because both records exist.', false]
      ],
      why:'Two rows may be valid depending on the data model. First establish identifiers, expected behavior and evidence.'
    },
    {
      title:'Query evidence',
      scenario:'Which is the safest support habit when investigating data?',
      answers:[
        ['Use the minimum necessary approved data and identifiers, document the evidence, and avoid unnecessary personal information.', true],
        ['Copy the entire customer database into personal notes.', false],
        ['Export credentials for easier access.', false],
        ['Store production data in a public repository.', false]
      ],
      why:'Support investigations should minimize data exposure and follow company authorization and security controls.'
    }
  ],
  cloud: [
    {
      title:'“The cloud is down”',
      scenario:'A customer says the whole cloud is down because the application is slow. What should you do?',
      answers:[
        ['Clarify the affected service, scope, symptom and timing before identifying a likely component.', true],
        ['Accept the statement as the diagnosis.', false],
        ['Delete the application cache immediately.', false],
        ['Tell the customer every cloud service is having an outage.', false]
      ],
      why:'Cloud environments contain multiple services and dependencies. “Cloud is down” is a symptom/claim, not a sufficiently precise diagnosis.'
    },
    {
      title:'Widespread slowdown',
      scenario:'Many customers report slow responses at the same time. What is useful evidence?',
      answers:[
        ['Scope, start time, affected functionality, error/latency signals and any approved incident indicators.', true],
        ['Only one customer’s browser version.', false],
        ['A random database change.', false],
        ['Individual password resets.', false]
      ],
      why:'A widespread pattern changes the investigation. Correlated timing and scope can indicate a shared dependency or incident.'
    },
    {
      title:'Logs',
      scenario:'Why are logs useful during technical support investigations?',
      answers:[
        ['They can provide timestamped evidence about application events, errors and processing behavior.', true],
        ['They automatically prove the root cause in every case.', false],
        ['They replace customer communication entirely.', false],
        ['They should always be copied into public tickets.', false]
      ],
      why:'Logs are evidence, not automatically a root-cause verdict. They must be interpreted within the approved process and protected appropriately.'
    }
  ],
  auth: [
    {
      title:'Authentication vs authorization',
      scenario:'A user can sign in but cannot access a feature they should have access to. Which concept should you investigate?',
      answers:[
        ['Authorization/permissions, while confirming the expected access according to the documented policy.', true],
        ['Only DNS.', false],
        ['Password reset immediately.', false],
        ['Ask for their password.', false]
      ],
      why:'Successful sign-in establishes authentication, but feature access can still be controlled by authorization and permissions.'
    },
    {
      title:'Safe credential handling',
      scenario:'A customer offers to paste their password into chat so you can troubleshoot. What should you do?',
      answers:[
        ['Do not collect the password; use the approved recovery or verification process.', true],
        ['Accept it and store it in notes.', false],
        ['Send it to another agent.', false],
        ['Put it in a screenshot for the ticket.', false]
      ],
      why:'Passwords and other secrets should not be collected or stored through ordinary support channels.'
    },
    {
      title:'403 response',
      scenario:'An authenticated API request returns 403. What is a reasonable investigation direction?',
      answers:[
        ['Check authorization, permissions/scopes and access rules according to the documented process.', true],
        ['Assume the password is wrong.', false],
        ['Assume DNS failed.', false],
        ['Ask for the private key.', false]
      ],
      why:'403 commonly indicates the request is understood but access is not permitted. Confirm the relevant authorization evidence.'
    }
  ],
  webhooks: [
    {
      title:'No event received',
      scenario:'A customer says they never received a webhook. What should you separate first?',
      answers:[
        ['Whether the event was generated and whether a delivery attempt exists.', true],
        ['Whether the customer knows their password.', false],
        ['Whether their laptop has enough RAM.', false],
        ['Whether they should reinstall the application.', false]
      ],
      why:'Separating event generation from delivery narrows the investigation without guessing.'
    },
    {
      title:'Endpoint returns 500',
      scenario:'Webhook delivery was attempted but the receiving endpoint returned HTTP 500. What is useful evidence?',
      answers:[
        ['Delivery timestamp, event type, response code and approved delivery/retry information.', true],
        ['The customer’s secret key.', false],
        ['A random DNS change.', false],
        ['A new billing plan.', false]
      ],
      why:'The response code and delivery evidence show that the request reached a receiving endpoint but server-side processing failed there.'
    },
    {
      title:'Retry behavior',
      scenario:'A webhook delivery failed temporarily. Why is retry behavior important?',
      answers:[
        ['It helps determine whether the system will attempt delivery again and what the documented recovery path is.', true],
        ['Retries guarantee the receiving system will recover.', false],
        ['Retries mean no evidence needs to be collected.', false],
        ['Retries should always be disabled.', false]
      ],
      why:'Retry behavior is part of delivery semantics. Support should use the documented retry and recovery process rather than assume success.'
    }
  ]
};

const referenceData = {
  networking:{
    label:'Networking',
    summary:'How a support agent can reason about connectivity without jumping to a conclusion.',
    visual:[
      ['Client','The customer device or application starts the request.'],
      ['DNS','Turns a hostname into an address when name resolution is required.'],
      ['Network path','Traffic travels through networks and intermediaries.'],
      ['Server / application','The destination receives and processes the request.']
    ],
    concepts:[
      ['DNS','Name resolution: a hostname such as app.example.test needs to resolve to an address before the client can reach the destination by name.'],
      ['Latency','Time taken for data to travel and receive a response. High latency can make an otherwise working service feel slow.'],
      ['Timeout','The client stopped waiting because a response was not received within its configured waiting period.'],
      ['Connectivity','Whether the client can establish the required network path to the destination.']
    ],
    support:'Start with scope and observable evidence: one user or many, all websites or one application, exact error, timestamps and reproducibility. Then narrow the layer.',
    example:'Customer: “The site is not opening.” Good first thinking: “What exactly happens, does anything else work, and is the issue reproducible?”',
    check:'Avoid saying “it is DNS” or “the internet is down” before you have evidence.'
  },
  api:{
    label:'REST API',
    summary:'A support-oriented model of requests, responses and HTTP status codes.',
    visual:[
      ['Client','Builds and sends a request.'],
      ['HTTP request','Method + URL/path + headers + optional body.'],
      ['API / server','Authenticates, validates and processes the request.'],
      ['HTTP response','Status code + headers + optional response body.']
    ],
    concepts:[
      ['GET','Usually retrieves a resource.'],
      ['POST','Usually creates or submits data for processing.'],
      ['PUT / PATCH','Commonly used to replace or partially update a resource.'],
      ['Headers','Metadata about the request/response, often including content type and authentication information.'],
      ['JSON','A common structured data format used in API request and response bodies.'],
      ['401','Authentication was not accepted.'],
      ['403','The request is understood but access is not permitted.'],
      ['404','The requested resource/path was not found.'],
      ['429','The request was rate limited.'],
      ['5xx','A server-side processing signal; investigate the documented service behavior and evidence.']
    ],
    support:'Treat a status code as a signal, not the whole diagnosis. Capture the endpoint, method, timestamp, response code, safe request evidence and relevant error body according to the approved process.',
    example:'Customer: “My API call fails.” Good thinking: identify the exact endpoint/action, method, response code and whether the failure is consistent.',
    check:'Never request a customer password, private key, seed phrase or secret token merely to troubleshoot an API issue.'
  },
  sql:{
    label:'SQL & Databases',
    summary:'Enough database vocabulary to investigate support problems safely.',
    visual:[
      ['Application','Reads/writes business data through approved services.'],
      ['Database','Stores structured records.'],
      ['Table','Groups records with related fields.'],
      ['Row / record','Represents one stored record.']
    ],
    concepts:[
      ['Table','A structured collection of records.'],
      ['Row','One record in a table.'],
      ['Column','One attribute/field of a record.'],
      ['Primary key','A field or combination used to uniquely identify a record.'],
      ['SELECT','Reads data; for example, filtering records that match approved criteria.'],
      ['WHERE','Restricts which records a query returns.'],
      ['JOIN','Combines related data from multiple tables using a relationship.']
    ],
    support:'The goal is evidence, not experimentation. Use only authorized access, minimum necessary data and approved identifiers. Document what you observed before suggesting a correction.',
    example:'Customer: “My order is missing.” Investigate whether the expected record exists, what state it is in, and what timestamps or related records show.',
    check:'Do not copy production data into personal notes, repositories or this training project.'
  },
  cloud:{
    label:'Cloud',
    summary:'A simple model for separating compute, storage, databases and traffic-handling components.',
    visual:[
      ['Client','Requests the application.'],
      ['Traffic layer','A load balancer or gateway may distribute or route requests.'],
      ['Compute','Application workloads execute here.'],
      ['Database / storage','Persistent application data and files are stored separately.']
    ],
    concepts:[
      ['Compute','Resources that execute application workloads.'],
      ['Storage','Persistent files/objects or volumes, depending on the service.'],
      ['Database','Managed or self-managed data store used by the application.'],
      ['Load balancer','Can distribute incoming traffic across available application instances.'],
      ['Logs','Timestamped records of application/system events.'],
      ['Monitoring','Measurements and signals used to understand service health and performance.']
    ],
    support:'“The cloud is down” is not a technical diagnosis. Establish affected service, scope, start time, symptom and approved incident indicators.',
    example:'Many users report slow responses at the same time. Correlated timing and scope are useful evidence when determining whether a shared component or incident may be involved.',
    check:'Logs and monitoring are evidence. They do not automatically prove root cause.'
  },
  auth:{
    label:'Authentication & Authorization',
    summary:'Understand who is signed in, what they can access, and how to handle secrets safely.',
    visual:[
      ['Identity','The system establishes who/what is making the request.'],
      ['Authentication','Credentials or another approved mechanism proves identity.'],
      ['Authorization','Policies/roles/scopes determine permitted actions.'],
      ['Resource','The user or service attempts to access something.']
    ],
    concepts:[
      ['Authentication','Establishes identity.'],
      ['Authorization','Determines what an authenticated identity is allowed to do.'],
      ['Session','A mechanism that can maintain authenticated state between requests.'],
      ['Token','A credential/artifact used by an approved authentication mechanism; treat it as sensitive when applicable.'],
      ['401','Authentication was not accepted.'],
      ['403','Access is not permitted despite the request being understood.']
    ],
    support:'Use approved verification and recovery procedures. Never ask customers to share passwords, private keys, seed phrases or other secrets through ordinary support channels.',
    example:'User can sign in but cannot use a feature. Investigate authorization/permissions rather than automatically resetting the password.',
    check:'Security boundaries are hard boundaries: protect secrets and follow company-approved processes.'
  },
  webhooks:{
    label:'Webhooks',
    summary:'Understand event generation, delivery attempts, endpoint responses and retries.',
    visual:[
      ['Event','Something happens in the source system.'],
      ['Delivery','The source sends an HTTP request containing event information.'],
      ['Endpoint','The receiving system accepts and processes the request.'],
      ['Retry / recovery','The documented system behavior may retry failed deliveries.']
    ],
    concepts:[
      ['Event','A recorded occurrence that may trigger a notification.'],
      ['Endpoint','The destination URL/service that receives the webhook request.'],
      ['Delivery attempt','An individual attempt to send the event.'],
      ['Response code','The receiving endpoint’s HTTP response to a delivery attempt.'],
      ['Retry','A subsequent attempt after a delivery failure, according to the system’s documented behavior.']
    ],
    support:'Separate “was the event generated?” from “was delivery attempted?” and “what did the endpoint return?” That structure prevents guesswork.',
    example:'Customer: “The event never arrived.” First establish whether the source generated the event and whether a delivery attempt exists.',
    check:'Capture timestamps, event type and response information according to the approved process; do not request secrets.'
  }
};

const labScenarios = [
  {
    id:'api-401', topic:'REST API · Authentication', title:'API request returns 401',
    symptom:'A customer reports that an API request worked yesterday but now returns 401 Unauthorized.',
    evidence:['Endpoint: /v1/orders', 'Observed response: 401 Unauthorized', 'Issue reported for one integration', 'No secret credentials are available to support'],
    guidance:'A 401 is an authentication signal. First establish the request and authentication evidence; do not ask for secrets or assume the whole API is unavailable.',
    steps:[
      {title:'Establish the signal', question:'What should you verify first?', options:[
        ['Capture the exact endpoint, timestamp, request context and response without collecting secrets.',1,'Evidence collected'],
        ['Ask the customer to paste the access token.',0,'Unsafe data request'],
        ['Declare a platform outage.',0,'Unsupported conclusion']
      ], explanation:'Start with observable evidence and protect credentials.'},
      {title:'Narrow the authentication cause', question:'The request is reaching the API and the 401 is consistent. What is the next safe direction?', options:[
        ['Identify the authentication method and check credential status through the approved process.',1,'Authentication path checked'],
        ['Change database permissions.',0,'Unrelated component'],
        ['Delete and recreate the customer account.',0,'Unsupported corrective action']
      ], explanation:'Narrow the cause using the documented authentication path before changing anything.'},
      {title:'Take a safe action', question:'The approved check shows that the credential has expired. What should you do?', options:[
        ['Follow the approved renewal/rotation process without handling the secret directly.',1,'Safe corrective action'],
        ['Ask the customer to send the secret in chat.',0,'Secret exposure'],
        ['Disable authentication for the integration.',0,'Unsafe workaround']
      ], explanation:'Use the approved recovery path and avoid collecting sensitive credentials.'},
      {title:'Verify recovery', question:'The renewal process is complete. What must happen before resolution?', options:[
        ['Retest the request and confirm the expected successful response.',1,'Outcome verified'],
        ['Mark the case resolved without testing.',0,'Verification missing'],
        ['Delete the investigation evidence.',0,'Evidence should remain documented']
      ], explanation:'A corrective action is not proof of recovery. Verify the expected behavior.'}
    ]
  },
  {
    id:'dns', topic:'Networking · DNS', title:'Application hostname does not resolve',
    symptom:'A customer can reach other websites but receives a name-resolution error when opening the application hostname.',
    evidence:['Other websites are reachable', 'Application hostname fails to resolve', 'Issue currently reported for one customer', 'Exact hostname is available for testing'],
    guidance:'Other sites working narrows the scope. Investigate name resolution and distinguish DNS evidence from general connectivity assumptions.',
    steps:[
      {title:'Scope the symptom', question:'Which evidence should you establish first?', options:[
        ['Confirm the exact hostname, error and whether the failure reproduces consistently.',1,'Symptom scoped'],
        ['Reset the customer password.',0,'Unrelated component'],
        ['Assume the database is unavailable.',0,'Unsupported conclusion']
      ], explanation:'A precise hostname and reproducible error make the investigation testable.'},
      {title:'Check name resolution', question:'What should you investigate next?', options:[
        ['Determine whether the hostname resolves correctly and compare the result with the expected configuration.',1,'DNS evidence checked'],
        ['Change application permissions.',0,'Unrelated component'],
        ['Ask for the customer password.',0,'Unnecessary sensitive data']
      ], explanation:'The symptom points toward name resolution, but evidence should confirm the path.'},
      {title:'Choose the next action', question:'The evidence shows a name-resolution problem outside the application itself. What is appropriate?', options:[
        ['Follow the documented DNS/network escalation or remediation process with the collected evidence.',1,'Correct escalation path'],
        ['Delete the application.',0,'Destructive action'],
        ['Tell the customer the issue is permanently fixed.',0,'No verification']
      ], explanation:'Use the appropriate network/DNS process and preserve the evidence for the next team if needed.'},
      {title:'Verify the outcome', question:'After the DNS change or remediation, what should you confirm?', options:[
        ['Confirm the hostname resolves and the application can be reached as expected.',1,'Recovery verified'],
        ['Close the issue immediately after the change.',0,'Verification missing'],
        ['Ignore the original symptom.',0,'No proof of recovery']
      ], explanation:'Verify both the technical dependency and the customer-facing behavior.'}
    ]
  },
  {
    id:'webhook', topic:'Webhooks · Delivery', title:'Webhook event was not received',
    symptom:'A customer says an expected webhook never arrived at their endpoint.',
    evidence:['Expected event type: order.updated', 'Customer reports no event received', 'Endpoint URL is configured', 'No delivery evidence has been reviewed yet'],
    guidance:'Separate event generation from delivery. An event can exist without a successful delivery, so investigate both sides of the flow.',
    steps:[
      {title:'Confirm the expected event', question:'What should you establish first?', options:[
        ['Confirm the event type, expected time and a safe identifier for the affected event.',1,'Event scoped'],
        ['Ask for the endpoint secret.',0,'Sensitive information'],
        ['Assume the customer endpoint is broken.',0,'Unsupported assumption']
      ], explanation:'Start with a precise event and time window.'},
      {title:'Separate generation from delivery', question:'What is the most useful next check?', options:[
        ['Determine whether the event was generated and whether a delivery attempt exists.',1,'Event/delivery split'],
        ['Change unrelated account permissions.',0,'Unrelated component'],
        ['Restart every application server.',0,'Unsupported broad action']
      ], explanation:'This separates an event-generation issue from a delivery issue.'},
      {title:'Interpret delivery evidence', question:'A delivery attempt exists and returned HTTP 500. What should you investigate?', options:[
        ['Use the response, timestamps and retry history to determine whether the receiving endpoint is accepting the event.',1,'Delivery evidence'],
        ['Assume the sender database is corrupt.',0,'Unsupported conclusion'],
        ['Ask the customer for their private key.',0,'Secret exposure']
      ], explanation:'A 500 from the receiving endpoint is evidence about the delivery interaction, not proof of a database defect.'},
      {title:'Verify recovery', question:'The receiving endpoint has been corrected. What confirms resolution?', options:[
        ['Confirm a successful delivery and that the expected event was processed.',1,'Delivery verified'],
        ['Mark resolved after changing the endpoint.',0,'Verification missing'],
        ['Delete the failed delivery history.',0,'Evidence should be retained']
      ], explanation:'Verify the delivery and expected downstream result.'}
    ]
  },
  {
    id:'performance', topic:'Cloud · Performance', title:'Application is slow for many users',
    symptom:'Several customers report that page loads are taking much longer than normal at roughly the same time.',
    evidence:['Multiple customers affected', 'Symptoms started within the same time window', 'Requests complete but are slow', 'No confirmed outage yet'],
    guidance:'Wider scope and shared timing are useful signals. Avoid jumping from “slow” to a specific component without evidence.',
    steps:[
      {title:'Establish scope', question:'What should you confirm first?', options:[
        ['Compare affected users, start time, regions/features and the exact slow behavior.',1,'Scope established'],
        ['Assume every cloud provider is down.',0,'Overbroad conclusion'],
        ['Ask one customer for their password.',0,'Irrelevant and unsafe']
      ], explanation:'Scope and timing help distinguish an isolated client issue from a broader service problem.'},
      {title:'Find technical evidence', question:'Which evidence is most useful next?', options:[
        ['Review approved monitoring/latency signals and relevant logs for the affected service and time window.',1,'Service evidence'],
        ['Delete application data.',0,'Destructive action'],
        ['Change customer permissions.',0,'Unrelated component']
      ], explanation:'Use monitoring and logs to connect the symptom to a service component.'},
      {title:'Choose the response', question:'Evidence points to a service-level performance issue outside frontline support control. What is appropriate?', options:[
        ['Document the evidence and escalate through the defined technical incident path.',1,'Evidence-based escalation'],
        ['Promise an exact recovery time without confirmation.',0,'Unsupported promise'],
        ['Tell each customer to reinstall the application.',0,'Poorly targeted action']
      ], explanation:'Escalation should include useful evidence, scope and timing rather than a vague “it is slow.”'},
      {title:'Verify the outcome', question:'What should happen before the issue is considered recovered?', options:[
        ['Confirm the monitored and customer-facing performance has returned to the expected range.',1,'Recovery verified'],
        ['Close the issue because the incident team acknowledged it.',0,'Acknowledgement is not recovery'],
        ['Remove the monitoring evidence.',0,'Evidence should remain available']
      ], explanation:'Verify the service behavior, not merely the handoff.'}
    ]
  },
  {
    id:'authorization', topic:'Authentication · Authorization', title:'User can sign in but cannot use a feature',
    symptom:'A user successfully signs in but receives 403 Forbidden when opening a feature they expect to access.',
    evidence:['Login succeeds', 'Feature request returns 403 Forbidden', 'Issue reported for one user', 'Feature has role/permission controls'],
    guidance:'Successful authentication and a 403 point the investigation toward authorization or access policy. Do not treat this as a login failure.',
    steps:[
      {title:'Separate authentication from authorization', question:'What does the evidence suggest?', options:[
        ['Authentication succeeded; investigate authorization, role and feature-access evidence.',1,'Authz direction'],
        ['Reset the user password immediately.',0,'Wrong signal'],
        ['Assume the user cannot authenticate.',0,'Contradicted by evidence']
      ], explanation:'A successful login plus 403 is a strong reason to investigate authorization rather than authentication.'},
      {title:'Check access evidence', question:'What should you compare next?', options:[
        ['Review the user’s approved role/permission state against the documented feature-access requirement.',1,'Permission evidence'],
        ['Ask the user for their password.',0,'Sensitive data'],
        ['Change the database schema.',0,'Unrelated action']
      ], explanation:'Compare actual access state with the expected authorization rule.'},
      {title:'Apply the approved action', question:'The user is missing a required permission and the support process allows a role update. What should happen?', options:[
        ['Follow the authorized role/permission update process and document the change.',1,'Controlled action'],
        ['Give the user every available permission.',0,'Over-privileged access'],
        ['Disable authorization checks.',0,'Unsafe change']
      ], explanation:'Access changes should be limited to the documented requirement and authorized process.'},
      {title:'Verify access', question:'What confirms the issue is resolved?', options:[
        ['Retest the feature and confirm the expected access without weakening unrelated controls.',1,'Access verified'],
        ['Assume the permission update worked.',0,'Verification missing'],
        ['Close the issue after saving the role.',0,'No functional verification']
      ], explanation:'The final test should confirm the user can access the intended feature while controls remain intact.'}
    ]
  }
];

const kbArticles=[
{topic:"REST APIs",title:"API returns 401 Unauthorized",summary:"Separate authentication failure from authorization failure.",symptoms:["Requests return HTTP 401."],causes:["Missing/invalid/expired credential","Wrong environment"],evidence:["Endpoint and method","Timestamp/status","Request ID","Issue scope"],safe:["Confirm auth mechanism","Check expiry using authorized tooling","Retest without exposing secrets"],avoid:["Never request passwords or full tokens"],escalate:"Escalate if valid credentials are unexpectedly rejected."},
{topic:"Networking",title:"Hostname cannot be resolved",summary:"Separate DNS resolution from connectivity and application availability.",symptoms:["Hostname fails to resolve."],causes:["DNS record","Resolver/cache","Incorrect hostname"],evidence:["Hostname","Affected scope","Lookup result","Known-good comparison"],safe:["Confirm hostname","Compare affected/unaffected resolution","Record timestamp"],avoid:["Do not conclude the server is down from DNS alone"],escalate:"Escalate broad or incorrect DNS failures after local causes are excluded."},
{topic:"SQL & Databases",title:"Expected record is missing",summary:"Validate identifier, environment, filters, and timing before assuming data loss.",symptoms:["Expected record is not visible."],causes:["Wrong identifier","Wrong environment","Query/filter logic","Processing delay"],evidence:["Minimum necessary ID","Environment","Timestamp","Filters"],safe:["Validate scope","Use authorized read-only evidence","Compare processing state"],avoid:["Do not expose unrelated records or modify production data"],escalate:"Escalate unexpected data inconsistency or suspected defect."},
{topic:"Cloud",title:"Application is suddenly slow",summary:"Treat 'the cloud is slow' as a symptom and narrow it by scope, timing, and evidence.",symptoms:["Higher latency or timeouts."],causes:["Application load","Database latency","Network path","Dependency degradation"],evidence:["Start time","Affected scope","Latency","Error rate","Monitoring/log indicators"],safe:["Check scope","Compare with known-good period","Review monitoring/logs"],avoid:["Do not change production configuration without authorization"],escalate:"Escalate broad impact, rising errors, or infrastructure/application incident evidence."},
{topic:"Authentication",title:"User signs in but receives 403",summary:"Authentication proves identity; authorization controls resource access.",symptoms:["Login succeeds but protected resource returns 403."],causes:["Missing permission","Role mismatch","Resource policy"],evidence:["Role/permission","Resource","Status","Authorized comparison account"],safe:["Confirm authentication","Check minimum required permission","Compare expected vs assigned access"],avoid:["Do not request credentials or grant unnecessary access"],escalate:"Escalate when permissions appear correct but authorization still fails."},
{topic:"Webhooks",title:"Webhook event was not received",summary:"Separate event generation from delivery and endpoint behavior.",symptoms:["Expected event is absent at the receiver."],causes:["Event not generated","Delivery failed","Endpoint unavailable","Configuration issue"],evidence:["Event type/time","Delivery ID","Response status","Retry history"],safe:["Confirm event generation","Check delivery attempts","Verify endpoint safely"],avoid:["Do not repeatedly trigger production events without authorization"],escalate:"Escalate suspected event-generation or delivery infrastructure failure."}];