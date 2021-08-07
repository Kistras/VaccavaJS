var lang = {}
var EN = {}
var RU = {}

EN['and'] = ' and '
RU['and'] = ' и '

// // // 

EN['ping'] = 'Hello!'
RU['ping'] = 'Привет!'

EN['config-main'] = 'Well, this is config.\nThere you can redefine bot prefix, log channel and other useless stuff.'
RU['config-main'] = 'Ну, это конфиг.\nЗдесь можно задать префикс для использования, канал для логов и другие ненужные штуки.'

EN['config-info-title'] = 'Current config for this guild.'
RU['config-info-title'] = 'Текущий конфиг этого сервера.'

EN['config-invalid-field'] = 'There is... no field like that. You can get possible to edit fields if you use command "config" without any arguments.'
RU['config-invalid-field'] = 'Такого... поля в конфиге нет. Возможные поля для редактирования ты можешь получить, использовав команду "config" без аргументов.'

EN['config-editing-error'] = 'Something weird happened during editing config.'
RU['config-editing-error'] = 'Что-то странное произошло во время редактирования конфига.'

EN['config-editing-success'] = 'Config was successfully edited!'
RU['config-editing-success'] = 'Конфиг был успешно отредактирован!'

EN['config-editing-result'] = 'Changed value in config!'
RU['config-editing-result'] = 'Значение в конфиге было изменено!'

EN['roll-result'] = 'A random number between '
RU['roll-result'] = 'Случайное число между '

EN['puro'] = "Whoops, guess I ain't this fluffy latex beast you're searchin' for. Try next time with some other bot that will actually give you some stuff."
RU['puro'] = 'Упс, похоже, что я не тот пушистый латексный зверь, которого ты ищешь. В следующий раз попробуй это с каким-нибудь другим ботом, который даст тебе настоящего Пуро.'
//
lang['russia'] = RU
lang['default'] = EN
module.exports.getlang = function(field, guild) {
    if (guild.region in lang && field in lang[guild.region])
        return lang[guild.region][field]
    else
        if (field in lang['default'])
            return lang['default'][field]
        else
            return 'FIELD NOT FOUND PLZ CREATE ISSUE - https://github.com/Kistras/VaccavaJS'
}
