import cn from 'classnames'
import React, { useContext, useEffect, useState } from 'react'
import { getAssets } from '../api/Api'
import { useUAL } from '../../hooks/ual'
import LoadingIndicator from '../loadingindicator/LoadingIndicator'
import { Context } from '../marketwrapper'
import SelectableAssetPreview from './SelectableAssetPreview'
function MyAssetList(props) {
    const templates = props['templates']
    const [state, dispatch] = useContext(Context)

    const ual = useUAL()
    const activeUser = ual['activeUser']
    const userName = activeUser ? activeUser['accountName'] : null

    const [assets, setAssets] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const templatesNeeded = props['templatesNeeded']

    const parseAssetResult = (result) => {
        const assets = []

        result.map((res) => {
            if (res && res.success) {
                res.data.map((asset) => {
                    assets.push(asset)
                })
            }
        })

        setIsLoading(false)

        setAssets(assets)
    }

    useEffect(() => {}, [assets.length])

    useEffect(() => {
        if (userName) {
            Promise.all(
                templates.map((template) =>
                    getAssets({
                        template_id: template.template_id,
                        collections: [template.collection.collection_name],
                        user: userName,
                        limit: 10,
                        sortBy: 'template_mint',
                        orderDir: 'desc',
                    }),
                ),
            ).then((res) => parseAssetResult(res))
        }
    }, [userName])

    return (
        <div className={cn('w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6')}>
            {isLoading ? (
                <LoadingIndicator />
            ) : (
                assets.map((asset) => <SelectableAssetPreview asset={asset} templatesNeeded={templatesNeeded} />)
            )}
        </div>
    )
}

export default MyAssetList
