##
# 油菜花系统配置
##
# 需保活的Token 
# 多个Token保活示例: $YchToken = '1111', '2222'
$YchToken = '114514'
$YchKeepAliveUri = 'https://pw.gzych.vip/ykb_huiyuan/api/v1/Member/GetMemberStoredValue'

foreach ( $Token in $YchToken ) {  
    $Headers = @{
        'Authorization' = $Token
    }

    try {
        $KeepAliveRequest = Invoke-WebRequest -Uri $YchKeepAliveUri -Headers $Headers
        Write-Host -ForegroundColor Green "Token有效"
    } catch {
        Write-Host -ForegroundColor Red "Token无效,需重新获取"
        continue
    }
}

exit