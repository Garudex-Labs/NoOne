use std::sync::OnceLock;

/// Build-time presentation, distinct from signed package and executable names.
pub fn application_name() -> &'static str {
    static NAME: OnceLock<String> = OnceLock::new();
    NAME.get_or_init(|| {
        let identity: serde_json::Value = serde_json::from_str(include_str!(
            "../../../../agent_cli/data/application_identity.json"
        ))
        .expect("valid packaged application identity");
        identity["default_name"].as_str().expect("application default name").to_owned()
    })
}
