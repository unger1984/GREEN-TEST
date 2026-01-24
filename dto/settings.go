package dto

// StateInstanceType представляет тип состояния инстанса
type StateInstanceType string

const (
	StateNotAuthorized StateInstanceType = "notAuthorized"
	StateAuthorized   StateInstanceType = "authorized"
	StateBlocked       StateInstanceType = "blocked"
	StateSleepMode     StateInstanceType = "sleepMode"
	StateStarting      StateInstanceType = "starting"
	StateYellowCard    StateInstanceType = "yellowCard"
)

// YesNo представляет тип да/нет
type YesNo string

const (
	Yes YesNo = "yes"
	No  YesNo = "no"
)

// SettingsDto представляет структуру настроек
type SettingsDto struct {
	Wid                              string           `json:"wid"`
	CountryInstance                   string           `json:"countryInstance"`
	TypeAccount                      string           `json:"typeAccount"`
	WebhookUrl                       string           `json:"webhookUrl"`
	WebhookUrlToken                  string           `json:"webhookUrlToken"`
	DelaySendMessagesMilliseconds     int              `json:"delaySendMessagesMilliseconds"`
	MarkIncomingMessagesReaded       YesNo            `json:"markIncomingMessagesReaded"`
	MarkIncomingMessagesReadedOnReply YesNo           `json:"markIncomingMessagesReadedOnReply"`
	SharedSession                    string           `json:"sharedSession"`
	ProxyInstance                   string           `json:"proxyInstance"`
	OutgoingWebhook                 YesNo            `json:"outgoingWebhook"`
	OutgoingMessageWebhook          YesNo            `json:"outgoingMessageWebhook"`
	OutgoingAPIMessageWebhook        YesNo            `json:"outgoingAPIMessageWebhook"`
	IncomingWebhook                 YesNo            `json:"incomingWebhook"`
	DeviceWebhook                   YesNo            `json:"deviceWebhook"`
	StatusInstanceWebhook           string           `json:"statusInstanceWebhook"`
	StateWebhook                    YesNo            `json:"stateWebhook"`
	EnableMessagesHistory           string           `json:"enableMessagesHistory"`
	KeepOnlineStatus                string           `json:"keepOnlineStatus"`
	PollMessageWebhook               YesNo            `json:"pollMessageWebhook"`
	IncomingBlockWebhook            YesNo            `json:"incomingBlockWebhook"`
	IncomingCallWebhook              YesNo            `json:"incomingCallWebhook"`
	EditedMessageWebhook            YesNo            `json:"editedMessageWebhook"`
	DeletedMessageWebhook           YesNo            `json:"deletedMessageWebhook"`
}

// StateInstanceDto представляет структуру состояния инстанса
type StateInstanceDto struct {
	StateInstance StateInstanceType `json:"stateInstance"`
}