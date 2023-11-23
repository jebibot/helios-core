import { DisplayableError, RestResponse } from '../../common/rest/RestResponse'

/**
 * Various error codes from any point of the Microsoft authentication process.
 */
export enum MicrosoftErrorCode {
    /**
     * Unknown Error
     */
    UNKNOWN,
    /**
     * Profile Error
     * 
     * Account has not set up a minecraft profile or does not own the game.
     * 
     * Note that Xbox Game Pass users who haven't logged into the new Minecraft
     * Launcher at least once will not return a profile, and will need to login
     * once after activating Xbox Game Pass to setup their Minecraft username.
     * 
     * @see https://wiki.vg/Microsoft_Authentication_Scheme#Get_the_profile
     */
    NO_PROFILE,
    /**
     * XSTS Error
     * 
     * The account doesn't have an Xbox account. Once they sign up for one
     * (or login through minecraft.net to create one) then they can proceed
     * with the login. This shouldn't happen with accounts that have purchased
     * Minecraft with a Microsoft account, as they would've already gone
     * through that Xbox signup process.
     * 
     * @see https://wiki.vg/Microsoft_Authentication_Scheme#Authenticate_with_XSTS
     */
    NO_XBOX_ACCOUNT = 2148916233,
    /**
     * XSTS Error
     * 
     * The account is from a country where Xbox Live is not available/banned.
     * 
     * @see https://wiki.vg/Microsoft_Authentication_Scheme#Authenticate_with_XSTS
     */
    XBL_BANNED = 2148916235,
    /**
     * XSTS Error
     * 
     * The account is a child (under 18) and cannot proceed unless the account
     * is added to a Family by an adult. This only seems to occur when using a
     * custom Microsoft Azure application. When using the Minecraft launchers
     * client id, this doesn't trigger.
     * 
     * @see https://wiki.vg/Microsoft_Authentication_Scheme#Authenticate_with_XSTS
     */
    UNDER_18 = 2148916238
}

export function microsoftErrorDisplayable(errorCode: MicrosoftErrorCode): DisplayableError {
    switch(errorCode) {
        case MicrosoftErrorCode.NO_PROFILE:
            return {
                title: '로그인 중 오류:<br>프로필이 설정되지 않음',
                desc: 'Microsoft 계정에 아직 Minecraft 프로필이 설정되어 있지 않습니다. 최근에 게임을 구매했거나 Xbox Game Pass를 통해 게임을 교환한 경우, <a href="https://minecraft.net/">Minecraft.net</a>에서 프로필을 설정해야 합니다.<br><br>이미 프로필이 있으신 경우, <a href="https://minecraft.net/login">Minecraft.net</a>에서 로그인 후 다시 시도해 보세요.'
            }
        case MicrosoftErrorCode.NO_XBOX_ACCOUNT:
            return {
                title: '로그인 중 오류:<br> Xbox 계정이 없음',
                desc: 'Microsoft 계정에 연결된 Xbox 계정이 없습니다.'
            }
        case MicrosoftErrorCode.XBL_BANNED:
            return {
                title: '로그인 중 오류:<br>Xbox Live를 사용할 수 없음',
                desc: 'Xbox Live를 사용할 수 없거나 금지된 국가의 Microsoft 계정입니다.'
            }
        case MicrosoftErrorCode.UNDER_18:
            return {
                title: '로그인 중 오류 :<br>보호자 동의 필요',
                desc: '만 18세 미만 사용자의 계정은 성인이 가족에 추가해야 합니다.'
            }
        case MicrosoftErrorCode.UNKNOWN:
            return {
                title: '로그인 중 오류',
                desc: '알 수 없는 오류가 발생했습니다. 관리자에게 문의 부탁드립니다.'
            }
    }
}

export interface MicrosoftResponse<T> extends RestResponse<T> {
    microsoftErrorCode?: MicrosoftErrorCode
}

/**
 * Resolve the error response code from the response body.
 * 
 * @param body The microsoft error body response.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decipherErrorCode(body: any): MicrosoftErrorCode {

    if(body) {
        if(body.XErr) {
            const xErr: number = body.XErr as number
            switch(xErr) {
                case MicrosoftErrorCode.NO_XBOX_ACCOUNT:
                    return MicrosoftErrorCode.NO_XBOX_ACCOUNT
                case MicrosoftErrorCode.XBL_BANNED:
                    return MicrosoftErrorCode.XBL_BANNED
                case MicrosoftErrorCode.UNDER_18:
                    return MicrosoftErrorCode.UNDER_18
            }
        }
    }

    return MicrosoftErrorCode.UNKNOWN
}